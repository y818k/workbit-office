import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

const nodeBinEntrypoints = {
  tsc: ['node_modules', 'typescript', 'bin', 'tsc'],
  vite: ['node_modules', 'vite', 'bin', 'vite.js']
};

export function runInstalledTool(toolName, args, expectedOutputs) {
  const command = resolveInstalledTool(toolName);

  if (!command) {
    console.error(`${toolName} was not found in local dependencies.`);
    return false;
  }

  const result = runCommand(command.executable, [...command.prefixArgs, ...args], toolName);

  if (!result.ok) {
    console.error(`${toolName} failed; falling back to generated build artifacts.`);
    return false;
  }

  const missingOutputs = getMissingOutputs(expectedOutputs);
  if (missingOutputs.length > 0) {
    console.error(`${toolName} completed, but expected output file(s) were not generated:`);
    for (const outputPath of missingOutputs) {
      console.error(`- ${outputPath}`);
    }
    return false;
  }

  return true;
}

export function assertOutputs(expectedOutputs, buildName) {
  const missingOutputs = getMissingOutputs(expectedOutputs);

  if (missingOutputs.length > 0) {
    console.error(`${buildName} completed, but expected output file(s) were not generated:`);
    for (const outputPath of missingOutputs) {
      console.error(`- ${outputPath}`);
    }
    process.exit(1);
  }
}

function getMissingOutputs(expectedOutputs = []) {
  return expectedOutputs.filter((outputPath) => !existsSync(join(root, outputPath)));
}

function resolveInstalledTool(toolName) {
  const nodeEntrypoint = nodeBinEntrypoints[toolName];

  if (nodeEntrypoint) {
    const toolPath = join(root, ...nodeEntrypoint);
    if (existsSync(toolPath)) {
      return { executable: process.execPath, prefixArgs: [toolPath] };
    }
  }

  const executable = findLocalExecutable(toolName);
  if (executable) {
    return { executable, prefixArgs: [] };
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

function runCommand(command, args, label) {
  console.log(`Running ${label}: ${[command, ...args].join(' ')}`);

  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32' && /\.(cmd|ps1)$/i.test(command)
  });

  if (result.error) {
    console.error(`${label} could not be started: ${result.error.message}`);
    return { ok: false };
  }

  const status = result.status ?? 1;
  if (status !== 0) {
    console.error(`${label} exited with status ${status}.`);
    return { ok: false };
  }

  return { ok: true };
}
