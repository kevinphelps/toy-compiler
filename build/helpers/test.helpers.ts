export function getTestCommand(command: string) {
  return `nyc --silent --no-clean ${command}`;
}
