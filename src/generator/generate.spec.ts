import { DefNode, ExpressionNode, FunctionCallNode, IntegerLiteralNode, VariableReferenceNode } from './../parser/nodes';
import { generate } from './generate';

describe('generate', () => {
  it('should throw if a tree contains an unknown token', () => {
    class OtherExpressionNode extends ExpressionNode {}
    const tree = new DefNode('f', ['a'], new OtherExpressionNode());

    expect(() => generate(tree)).toThrowError("Unexpected node 'OtherExpressionNode {}'.");
  });

  it('should generate an empty program', () => {
    expect(generate(null)).toBe('');
  });

  it('should generate an empty function', () => {
    const tree = new DefNode('f', [], null);

    const js = 'function f() { }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a call statement for a main function', () => {
    const tree = new DefNode('main', [], null);

    const js = 'function main() { }\nmain();\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that takes one parameter', () => {
    const tree = new DefNode('f', ['a'], null);

    const js = 'function f(a) { }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that takes several parameters', () => {
    const tree = new DefNode('f', ['a', 'b', 'c'], null);

    const js = 'function f(a, b, c) { }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function', () => {
    const tree = new DefNode('f', [], new FunctionCallNode('g', []));

    const js = 'function f() { g(); }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with one integer literal parameter', () => {
    const tree = new DefNode('f', [], new FunctionCallNode('g', [new IntegerLiteralNode(1)]));

    const js = 'function f() { g(1); }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with one variable reference parameter', () => {
    const tree = new DefNode('f', [], new FunctionCallNode('g', [new VariableReferenceNode('x')]));

    const js = 'function f() { g(x); }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with a nested function call', () => {
    const tree = new DefNode('f', [], new FunctionCallNode('g', [new FunctionCallNode('h', [])]));

    const js = 'function f() { g(h()); }\n';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with several different kinds of parameters', () => {
    const tree = new DefNode(
      'f',
      [],
      new FunctionCallNode('g', [
        new VariableReferenceNode('x'),
        new IntegerLiteralNode(1),
        new FunctionCallNode('y', [new VariableReferenceNode('z')]),
      ])
    );

    const js = 'function f() { g(x, 1, y(z)); }\n';

    expect(generate(tree)).toBe(js);
  });
});
