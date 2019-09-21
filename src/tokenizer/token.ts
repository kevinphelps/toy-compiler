export enum TokenType {
  DefKeyword,
  EndKeyword,
  Identifier,
  Integer,
  OpenParen,
  CloseParen,
  Comma,
}

export class Token {
  constructor(readonly type: TokenType, readonly value: string) {}
}
