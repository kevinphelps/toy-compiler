import { DefNode, ExpressionNode, FunctionCallNode, IntegerLiteralNode, SourceFile, VariableReferenceNode } from './../parser/nodes';
import { generate } from './generate';

describe('generate', () => {
  it('should throw if a tree contains an unknown node', () => {
    class OtherExpressionNode extends ExpressionNode {}
    const tree = new SourceFile([new DefNode('f', ['a'], new OtherExpressionNode())]);

    expect(() => generate(tree)).toThrowError("Unexpected node 'OtherExpressionNode {}'.");
  });

  it('should generate an empty program', () => {
    expect(generate(null)).toBe('');
  });

  it('should generate an empty function', () => {
    const tree = new SourceFile([new DefNode('f', [], null)]);
    const js = 'function f() { }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that takes one parameter', () => {
    const tree = new SourceFile([new DefNode('f', ['a'], null)]);
    const js = 'function f(a) { }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that takes several parameters', () => {
    const tree = new SourceFile([new DefNode('f', ['a', 'b', 'c'], null)]);
    const js = 'function f(a, b, c) { }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function', () => {
    const tree = new SourceFile([new DefNode('f', [], new FunctionCallNode('g', []))]);
    const js = 'function f() { g(); }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with one integer literal parameter', () => {
    const tree = new SourceFile([new DefNode('f', [], new FunctionCallNode('g', [new IntegerLiteralNode(1)]))]);
    const js = 'function f() { g(1); }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with one variable reference parameter', () => {
    const tree = new SourceFile([new DefNode('f', [], new FunctionCallNode('g', [new VariableReferenceNode('x')]))]);
    const js = 'function f() { g(x); }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with a nested function call', () => {
    const tree = new SourceFile([new DefNode('f', [], new FunctionCallNode('g', [new FunctionCallNode('h', [])]))]);
    const js = 'function f() { g(h()); }';

    expect(generate(tree)).toBe(js);
  });

  it('should generate a function that calls another function with several different kinds of parameters', () => {
    const tree = new SourceFile([
      new DefNode(
        'f',
        [],
        new FunctionCallNode('g', [
          new VariableReferenceNode('x'),
          new IntegerLiteralNode(1),
          new FunctionCallNode('y', [new VariableReferenceNode('z')]),
        ])
      ),
    ]);

    const js = 'function f() { g(x, 1, y(z)); }';

    expect(generate(tree)).toBe(js);
  });

  it('should emit library functions', () => {
    const tree = new SourceFile([
      new DefNode(
        'f',
        [],
        new FunctionCallNode('log', [new FunctionCallNode('add', [new IntegerLiteralNode(3), new IntegerLiteralNode(5)])])
      ),
    ]);

    const js = 'function f() { log(add(3, 5)); }\n\nfunction add(x,y){return x+y;}\nfunction log(value){console.log(value);return value;}';

    expect(generate(tree)).toBe(js);
  });

  it('should only emit library functions that are used', () => {
    const tree = new SourceFile([
      new DefNode('f', [], new FunctionCallNode('add', [new IntegerLiteralNode(3), new IntegerLiteralNode(5)])),
    ]);
    const js = 'function f() { add(3, 5); }\n\nfunction add(x,y){return x+y;}';

    expect(generate(tree)).toBe(js);
  });

  it("should generate a call statement for the 'main' function", () => {
    const tree = new SourceFile([new DefNode('main', [], null)]);
    const js = 'function main() { }\nmain();';

    expect(generate(tree)).toBe(js);
  });
});
