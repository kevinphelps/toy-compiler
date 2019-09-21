import { Token, TokenType } from './token';

export function tokenize(code: string) {
  const tokens: Token[] = [];

  while (code) {
    const token = tokenizeKeyword(code) || tokenizeIdentifer(code) || tokenizeInteger(code) || tokenizeSymbol(code);

    if (!token) {
      throw new Error(`Token not recognized at '${code}'.`);
    }

    tokens.push(token);
    code = code.substring(token.value.length).trim();
  }

  return tokens;
}

function tokenizeKeyword(code: string) {
  const keywordTokens: { [keyword: string]: TokenType } = {
    def: TokenType.DefKeyword,
    end: TokenType.EndKeyword,
  };

  for (const keyword of Object.keys(keywordTokens)) {
    if (code.match(new RegExp(`^(${keyword})(?:\\s|$)`))) {
      return new Token(keywordTokens[keyword], keyword);
    }
  }

  return null;
}

function tokenizeIdentifer(code: string) {
  const identifierMatch = code.match(/^([a-zA-Z]+)(?:[^\\w]|$)/);

  return identifierMatch ? new Token(TokenType.Identifier, identifierMatch[1]) : null;
}

function tokenizeInteger(code: string) {
  const integerMatch = code.match(/^([0-9]+)(?:[^\\w]|$)/);

  return integerMatch ? new Token(TokenType.Integer, integerMatch[1]) : null;
}

function tokenizeSymbol(code: string) {
  const symbolTokens: { [symbol: string]: TokenType } = {
    '(': TokenType.OpenParen,
    ')': TokenType.CloseParen,
    ',': TokenType.Comma,
  };

  for (const symbol of Object.keys(symbolTokens)) {
    if (code.startsWith(symbol)) {
      return new Token(symbolTokens[symbol], symbol);
    }
  }

  return null;
}
