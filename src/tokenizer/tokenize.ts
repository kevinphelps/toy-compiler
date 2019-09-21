import { Token, TokenType } from './token';

const tokenPatterns: [TokenType, RegExp][] = [
  [TokenType.DefKeyword, /^\bdef\b/],
  [TokenType.EndKeyword, /^\bend\b/],
  [TokenType.Identifier, /^\b[a-zA-Z]+\b/],
  [TokenType.Integer, /^\b[0-9]+\b/],
  [TokenType.OpenParen, /^\(/],
  [TokenType.CloseParen, /^\)/],
  [TokenType.Comma, /^,/],
];

export function tokenize(code: string) {
  const tokens: Token[] = [];

  while (code) {
    const token = getLeadingToken(code);

    tokens.push(token);
    code = code.substring(token.value.length).trim();
  }

  return tokens;
}

function getLeadingToken(code: string) {
  for (const [tokenType, pattern] of tokenPatterns) {
    const match = code.match(pattern);

    if (match) {
      const tokenValue = match[0];
      return new Token(tokenType, tokenValue);
    }
  }

  throw new Error(`Token not recognized at '${code}'.`);
}
