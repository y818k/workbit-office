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
  const nodeEntrypoint = nodeBinEntrypoints[toolName];

  if (nodeEntrypoint) {
    const toolPath = join(root, ...nodeEntrypoint);
    if (existsSync(toolPath)) {
      runCommand(process.execPath, [toolPath, ...args]);
      assertOutputs(expectedOutputs, toolName);
      return true;
    }
  }

  const executable = findLocalExecutable(toolName);
  if (executable) {
    runCommand(executable, args);
    assertOutputs(expectedOutputs, toolName);
    return true;
  }

  return false;
}

export function assertOutputs(expectedOutputs, buildName) {
  const missingOutputs = expectedOutputs.filter((outputPath) => !existsSync(join(root, outputPath)));

  if (missingOutputs.length > 0) {
    console.error(`${buildName} completed, but expected output file(s) were not generated:`);
    for (const outputPath of missingOutputs) {
      console.error(`- ${outputPath}`);
    }
    process.exit(1);
  }
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

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32' && /\.(cmd|ps1)$/i.test(command)
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exitCode = result.status ?? 1;
  if (process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
}
