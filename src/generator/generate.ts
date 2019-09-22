import { inspect } from 'util';

import { library } from './../library/library';
import { DefNode, FunctionCallNode, IntegerLiteralNode, ParseNode, VariableReferenceNode } from './../parser/nodes';

export function generate(root: ParseNode) {
  const libraryCalls: string[] = [];
  const js = generateInternal(root, libraryCalls);

  const jsWithLibraryFunctions = `${js}\n${libraryCalls.map(fnName => library[fnName]).join('\n')}`.trim();

  return `${jsWithLibraryFunctions}\n`;
}

export function generateInternal(node: ParseNode, libraryCalls: string[]): string {
  if (node === null) {
    return '';
  } else if (node instanceof DefNode) {
    const bodyJs = node.body ? ` ${generateInternal(node.body, libraryCalls)}; ` : ' ';
    const functionJs = `function ${node.name}(${node.parameterNames.join(', ')}) {${bodyJs}}`;
    return node.name === 'main' ? `${functionJs}\nmain();\n` : `${functionJs}\n`;
  } else if (node instanceof IntegerLiteralNode) {
    return node.value.toString();
  } else if (node instanceof VariableReferenceNode) {
    return node.name;
  } else if (node instanceof FunctionCallNode) {
    if (Object.keys(library).includes(node.name) && !libraryCalls.includes(node.name)) {
      libraryCalls.push(node.name);
    }

    return `${node.name}(${node.parameters.map(parameter => generateInternal(parameter, libraryCalls)).join(', ')})`;
  } else {
    throw new Error(`Unexpected node '${inspect(node)}'.`);
  }
}
