import { inspect } from 'util';

import { libraryFunctions } from './../library/library';
import { DefNode, ExpressionNode, FunctionCallNode, IntegerLiteralNode, VariableReferenceNode } from './../parser/nodes';

export function generate(root: DefNode) {
  const libraryCalls: string[] = [];
  const js = generateInternal(root, libraryCalls);

  const libraryJs = libraryCalls
    .sort()
    .map(functionName => libraryFunctions[functionName])
    .join('\n');

  return `${js}\n${libraryJs}`.trim();
}

function generateInternal(node: DefNode | ExpressionNode, libraryCalls: string[]): string {
  if (node === null) {
    return '';
  } else if (node instanceof DefNode) {
    return generateFunction(node, libraryCalls);
  } else if (node instanceof IntegerLiteralNode) {
    return node.value.toString();
  } else if (node instanceof VariableReferenceNode) {
    return node.name;
  } else if (node instanceof FunctionCallNode) {
    return generateFunctionCall(node, libraryCalls);
  } else {
    throw new Error(`Unexpected node '${inspect(node)}'.`);
  }
}

function generateFunction(defNode: DefNode, libraryCalls: string[]) {
  const bodyJs = defNode.body ? ` ${generateInternal(defNode.body, libraryCalls)}; ` : ' ';
  const functionJs = `function ${defNode.name}(${defNode.parameterNames.join(', ')}) {${bodyJs}}`;
  return defNode.name === 'main' ? `${functionJs}\nmain();\n` : `${functionJs}\n`;
}

function generateFunctionCall(functionCallNode: FunctionCallNode, libraryCalls: string[]) {
  if (Object.keys(libraryFunctions).includes(functionCallNode.name) && !libraryCalls.includes(functionCallNode.name)) {
    libraryCalls.push(functionCallNode.name);
  }

  const parametersJs = functionCallNode.parameters.map(parameter => generateInternal(parameter, libraryCalls));
  return `${functionCallNode.name}(${parametersJs.join(', ')})`;
}
