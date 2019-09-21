export enum TokenType {
  DefKeyword = 'DefKeyword',
  EndKeyword = 'EndKeyword',
  Identifier = 'Identifier',
  Integer = 'Integer',
  OpenParen = 'OpenParen',
  CloseParen = 'CloseParen',
  Comma = 'Comma',
}

export class Token {
  constructor(readonly type: TokenType, readonly value: string) {}
}
