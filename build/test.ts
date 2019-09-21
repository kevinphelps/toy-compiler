import { execute } from './helpers/shell.helpers';
import { getRemapCoverageCommand, getTestCommand } from './helpers/test.helpers';
import { parseFlags } from './helpers/utility.helpers';

interface Options {
  unit: boolean;
  e2e: boolean;
}

const defaultOptionsFn = (args: Options) => ({
  unit: !args.e2e,
  e2e: !args.unit,
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  await execute('rimraf ./dist-spec ./coverage');
  await execute(`tsc --project ./tsconfig.spec.json`);

  if (options.unit) {
    await unitTest();
  }

  if (options.e2e) {
    await execute('ts-node ./build/e2e.ts');
  }

  await execute('istanbul report -t lcov');
  await execute('istanbul report -t text-summary');
  await execute('istanbul check-coverage --statements 90 --branches 90 --functions 90 --lines 90');
})();

async function unitTest() {
  await execute(getTestCommand('unit', './node_modules/jasmine/bin/jasmine.js', '--config=jasmine.json'));
  await execute(getRemapCoverageCommand('unit'));
}
