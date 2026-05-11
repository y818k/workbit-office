import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('../', import.meta.url)));

const nodeBinEntrypoints = {
  tsc: ['node_modules', 'typescript', 'bin', 'tsc'],
  vite: ['node_modules', 'vite', 'bin', 'vite.js']
};

export function runInstalledTool(toolName, args, expectedOutputs) {
  const command = findInstalledToolCommand(toolName);

  if (!command) {
    console.warn(`[build] ${toolName} was not found under node_modules; using fallback build.`);
    return false;
  }

  console.log(`[build] Running ${toolName}: ${formatCommand(command.executable, command.args, args)}`);
  console.log(`[build] Working directory: ${root}`);

  const result = spawnSync(command.executable, [...command.args, ...args], {
    cwd: root,
    encoding: 'utf8',
    shell: command.shell
  });

  printSpawnOutput(result.stdout, process.stdout.write.bind(process.stdout));
  printSpawnOutput(result.stderr, process.stderr.write.bind(process.stderr));

  if (result.error) {
    console.error(`[build] Failed to start ${toolName}: ${result.error.message}`);
    console.error(`[build] Falling back because ${toolName} could not be started.`);
    return false;
  }

  if (result.signal) {
    console.error(`[build] ${toolName} was terminated by signal ${result.signal}.`);
    console.error(`[build] Falling back because ${toolName} did not complete.`);
    return false;
  }

  if (result.status !== 0) {
    console.error(`[build] ${toolName} exited with code ${result.status ?? 'unknown'}.`);
    console.error(`[build] Falling back after ${toolName} failure. See the logs above for the original error.`);
    return false;
  }

  if (!assertOutputs(expectedOutputs, toolName, { exitOnFailure: false })) {
    console.error(`[build] Falling back because ${toolName} did not create the expected output file(s).`);
    return false;
  }

  console.log(`[build] ${toolName} completed successfully.`);
  return true;
}

export function assertOutputs(expectedOutputs, buildName, options = { exitOnFailure: true }) {
  const missingOutputs = expectedOutputs.filter((outputPath) => !existsSync(join(root, outputPath)));

  if (missingOutputs.length === 0) {
    return true;
  }

  console.error(`[build] ${buildName} completed, but expected output file(s) were not generated:`);
  for (const outputPath of missingOutputs) {
    console.error(`[build] - ${outputPath}`);
  }

  if (options.exitOnFailure) {
    process.exit(1);
  }

  return false;
}

function findInstalledToolCommand(toolName) {
  const nodeEntrypoint = nodeBinEntrypoints[toolName];

  if (nodeEntrypoint) {
    const toolPath = join(root, ...nodeEntrypoint);
    if (existsSync(toolPath)) {
      return {
        executable: process.execPath,
        args: [toolPath],
        shell: false
      };
    }
  }

  const executable = findLocalExecutable(toolName);
  if (executable) {
    return {
      executable,
      args: [],
      shell: process.platform === 'win32' && /\.(cmd|ps1)$/i.test(executable)
    };
  }

  return undefined;
}

function findLocalExecutable(toolName) {
  const names = process.platform === 'win32'
    ? [`${toolName}.cmd`, `${toolName}.ps1`, `${toolName}.exe`, toolName]
    : [toolName];

  for (const name of names) {
    const executablePath = join(root, 'node_modules', '.bin', name);
    if (existsSync(executablePath)) {
      return executablePath;
    }
  }

  return undefined;
}

function printSpawnOutput(output, writer) {
  if (output && output.length > 0) {
    writer(output.endsWith('\n') ? output : `${output}\n`);
  }
}

function formatCommand(executable, baseArgs, runtimeArgs) {
  return [executable, ...baseArgs, ...runtimeArgs].map(quoteIfNeeded).join(' ');
}

function quoteIfNeeded(value) {
  return /\s/.test(value) ? `"${value}"` : value;
}
