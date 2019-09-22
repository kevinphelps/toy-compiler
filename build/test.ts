import { execute } from './helpers/shell.helpers';
import { getTestCommand } from './helpers/test.helpers';
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
  await execute('rimraf ./dist-spec ./coverage ./.nyc_output');
  await execute(`tsc --project ./tsconfig.spec.json`);

  if (options.unit) {
    await execute(getTestCommand('jasmine --config=jasmine.json'));
  }

  if (options.e2e) {
    await execute('ts-node ./build/e2e.ts');
  }

  await execute('nyc report --reporter=lcov --reporter=text');
  await execute('nyc check-coverage --statements 90 --branches 90 --functions 90 --lines 90');
})();
