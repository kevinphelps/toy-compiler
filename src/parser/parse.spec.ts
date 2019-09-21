import { Token, TokenType } from './../tokenizer/token';
import { DefNode, FunctionCallNode, IntegerLiteralNode, VariableReferenceNode } from './nodes';
import { parse } from './parse';

describe('parse', () => {
  it('should throw if program does not start with a def keyword token', () => {
    const tokens = [
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected 'def' keyword at start of program, but got a 'Identifier' token with value 'f'.");
  });

  it('should throw if a def token does not have a matching end token', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected a 'EndKeyword' token, but got nothing.");
  });

  it('should throw if there is a nested function definition', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected a 'EndKeyword' token, but got a 'DefKeyword' token with value 'def'.");
  });

  it('should throw if there is arbitrary code after a function definition', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
      new Token(TokenType.Identifier, 'f'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected end of program, but got a 'Identifier' token with value 'f'.");
  });

  it('should throw if there is a trailing comma in a def parameter list', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'a'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected next identifier in parameter list, but got a 'CloseParen' token with value ')'.");
  });

  it('should throw if there is a leading comma in a def parameter list', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.Identifier, 'a'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(() => parse(tokens)).toThrowError("Expected a 'CloseParen' token, but got a 'Comma' token with value ','.");
  });

  it('should throw if there is a trailing comma in a call parameter list', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Integer, '1'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(() => parse(tokens)).toThrowError(
      "Expected start of next expression in parameter list, but got a 'CloseParen' token with value ')'."
    );
  });

  it('should parse an empty program', () => {
    expect(parse([])).toBeNull();
  });

  it('should parse an empty function', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', [], null);

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that takes one parameter', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'a'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', ['a'], null);

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that takes several parameters', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'a'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.Identifier, 'b'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.Identifier, 'c'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', ['a', 'b', 'c'], null);

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that calls another function', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', [], new FunctionCallNode('g', []));

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that calls another function with one integer literal parameter', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Integer, '1'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', [], new FunctionCallNode('g', [new IntegerLiteralNode(1)]));

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that calls another function with one variable reference parameter', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'x'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', [], new FunctionCallNode('g', [new VariableReferenceNode('x')]));

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that calls another function with a nested function call', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'h'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode('f', [], new FunctionCallNode('g', [new FunctionCallNode('h', [])]));

    expect(parse(tokens)).toEqual(tree);
  });

  it('should parse a function that calls another function with several different kinds of parameters', () => {
    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.Identifier, 'g'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'x'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.Integer, '1'),
      new Token(TokenType.Comma, ','),
      new Token(TokenType.Identifier, 'y'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'z'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    const tree = new DefNode(
      'f',
      [],
      new FunctionCallNode('g', [
        new VariableReferenceNode('x'),
        new IntegerLiteralNode(1),
        new FunctionCallNode('y', [new VariableReferenceNode('z')]),
      ])
    );

    expect(parse(tokens)).toEqual(tree);
  });
});
