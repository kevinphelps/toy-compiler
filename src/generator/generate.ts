import { inspect } from 'util';

import { DefNode, FunctionCallNode, IntegerLiteralNode, ParseNode, VariableReferenceNode } from './../parser/nodes';

export function generate(node: ParseNode): string {
  if (node === null) {
    return '';
  } else if (node instanceof DefNode) {
    const bodyJs = node.body ? ` ${generate(node.body)}; ` : ' ';
    const functionJs = `function ${node.name}(${node.parameterNames.join(', ')}) {${bodyJs}}`;
    return node.name === 'main' ? `${functionJs}\nmain();\n` : `${functionJs}\n`;
  } else if (node instanceof IntegerLiteralNode) {
    return node.value.toString();
  } else if (node instanceof VariableReferenceNode) {
    return node.name;
  } else if (node instanceof FunctionCallNode) {
    return `${node.name}(${node.parameters.map(generate).join(', ')})`;
  } else {
    throw new Error(`Unexpected node '${inspect(node)}'.`);
  }
}
