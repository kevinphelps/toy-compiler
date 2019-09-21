import { Token, TokenType } from './token';
import { tokenize } from './tokenize';

describe('tokenize', () => {
  it('should throw if code starts with an invalid character', () => {
    const code = '@ def f() end';

    expect(() => tokenize(code)).toThrowError("Token not recognized at '@ def f() end'.");
  });

  it('should throw if code contains an invalid character', () => {
    const code = 'def f() @ end';

    expect(() => tokenize(code)).toThrowError("Token not recognized at '@ end'.");
  });

  it('should tokenize an empty program', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('should tokenize an empty function', () => {
    const code = 'def f() end';

    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that takes one parameter', () => {
    const code = 'def f(a) end';

    const tokens = [
      new Token(TokenType.DefKeyword, 'def'),
      new Token(TokenType.Identifier, 'f'),
      new Token(TokenType.OpenParen, '('),
      new Token(TokenType.Identifier, 'a'),
      new Token(TokenType.CloseParen, ')'),
      new Token(TokenType.EndKeyword, 'end'),
    ];

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that takes several parameters', () => {
    const code = 'def f(a, b, c) end';

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

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that calls another function', () => {
    const code = 'def f() g() end';

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

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that calls another function with one integer literal parameter', () => {
    const code = 'def f() g(1) end';

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

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that calls another function with one variable reference parameter', () => {
    const code = 'def f() g(x) end';

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

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that calls another function with a nested function call', () => {
    const code = 'def f() g(h()) end';

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

    expect(tokenize(code)).toEqual(tokens);
  });

  it('should tokenize a function that calls another function with several different kinds of parameters', () => {
    const code = 'def f() g(x, 1, y(z)) end';

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

    expect(tokenize(code)).toEqual(tokens);
  });
});
