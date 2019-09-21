import chalk from 'chalk';
import * as diff from 'diff';
import * as fs from 'fs';
import * as path from 'path';

import { execute } from './helpers/shell.helpers';
import { getTestCommand } from './helpers/test.helpers';
import { bail } from './helpers/utility.helpers';

(async () => {
  try {
    for (const testName of fs.readdirSync('./e2e')) {
      await test(testName);
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

async function test(testName: string) {
  const sourceFilePath = path.join('.', 'e2e', testName, 'input.src');
  const expectedJsPath = path.join('.', 'e2e', testName, 'output.js');
  const resultPath = path.join('.', 'e2e', testName, 'result.txt');

  const result = await execute(getTestCommand(`node ./dist-spec/toy-compiler-cli.js ${sourceFilePath}`), { stdio: 'pipe' }, false);

  if (result.code !== 0) {
    console.log(result);
    bail(`The '${testName}' e2e test failed because the compiler cli exited with an error.`);
  }

  const actualJs = normalizeNewLines(result.stdout);
  const expectedJs = normalizeNewLines(fs.readFileSync(expectedJsPath).toString());

  if (actualJs !== expectedJs) {
    console.log(formatPath(diff.createTwoFilesPatch('actual.js', 'expected.js', actualJs, expectedJs, '', '')));
    bail(`The '${testName}' e2e test did not produce the expected JS result.`);
  }

  // The actual JS is correct, so just execute the expected JS for the result.
  const actualResult = (await execute(`node ${expectedJsPath}`, { stdio: 'pipe' })).stdout;
  const expectedResult = normalizeNewLines(fs.readFileSync(resultPath).toString());

  if (actualResult !== expectedResult) {
    console.log(formatPath(diff.createTwoFilesPatch('actual.txt', 'expected.txt', actualResult, expectedResult, '', '')));
    bail(`The '${testName}' e2e test did not produce the expected result when executed.`);
  }
}

function normalizeNewLines(value: string) {
  return value ? value.replace(/\r?\n/g, '\n') : '';
}

function formatPath(patch: string) {
  return patch
    .split('\n')
    .map(line => (line.startsWith('-') ? chalk.red(line) : line.startsWith('+') ? chalk.green(line) : line))
    .join('\n');
}
