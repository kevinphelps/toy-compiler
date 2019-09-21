export function getTestCommand(testSet: string, script: string, args: string) {
  return `istanbul cover ${script} --dir ./coverage/${testSet} --print none -- ${args}`;
}

export function getRemapCoverageCommand(testSet: string) {
  return `remap-istanbul -i ./coverage/${testSet}/coverage.json -o ./coverage/${testSet}/coverage.json -t json`;
}
