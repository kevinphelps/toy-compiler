import { Token, TokenType } from './../tokenizer/token';
import { DefNode, ExpressionNode, FunctionCallNode, IntegerLiteralNode, ParseNode, VariableReferenceNode } from './nodes';

export function parse(tokens: Token[]) {
  tokens = [...tokens]; // preserve original array

  if (peek(TokenType.DefKeyword, tokens)) {
    return parseDef(tokens);
  }

  if (tokens.length) {
    throw new Error(getMessageWithToken('Expected end of program', tokens[0]));
  }

  return null as ParseNode;
}

function parseDef(tokens: Token[]) {
  consume(TokenType.DefKeyword, tokens);
  const name = parseIdentifier(tokens);
  const parameterNames = parseParameterNames(tokens);
  const body = parseExpression(tokens);
  consume(TokenType.EndKeyword, tokens);

  return new DefNode(name, parameterNames, body);
}

function parseIdentifier(tokens: Token[]) {
  return consume(TokenType.Identifier, tokens).value;
}

function parseParameterNames(tokens: Token[]) {
  const parameterNames: string[] = [];

  consume(TokenType.OpenParen, tokens);

  if (peek(TokenType.Identifier, tokens)) {
    parameterNames.push(parseIdentifier(tokens));

    while (peek(TokenType.Comma, tokens)) {
      consume(TokenType.Comma, tokens);
      parameterNames.push(parseIdentifier(tokens));
    }
  }

  consume(TokenType.CloseParen, tokens);

  return parameterNames;
}

function parseExpression(tokens: Token[]) {
  if (peek(TokenType.Integer, tokens)) {
    return parseIntegerLiteral(tokens);
  } else if (peek(TokenType.Identifier, tokens) && peek(TokenType.OpenParen, tokens, 1)) {
    return parseFunctionCall(tokens);
  } else if (peek(TokenType.Identifier, tokens)) {
    return parseVariableRefernce(tokens);
  } else {
    return null;
  }
}

function parseIntegerLiteral(tokens: Token[]) {
  const integerToken = consume(TokenType.Integer, tokens);

  return new IntegerLiteralNode(parseInt(integerToken.value, 10));
}

function parseVariableRefernce(tokens: Token[]) {
  const identifierToken = consume(TokenType.Identifier, tokens);

  return new VariableReferenceNode(identifierToken.value);
}

function parseFunctionCall(tokens: Token[]) {
  return new FunctionCallNode(parseIdentifier(tokens), parseParameters(tokens));
}

function parseParameters(tokens: Token[]) {
  const parameters: ExpressionNode[] = [];

  function pushNextExpression() {
    const expression = parseExpression(tokens);

    if (!expression) {
      throw new Error(getMessageWithToken('Expected start of next expression in parameter list', tokens[0]));
    }

    parameters.push(expression);
  }

  consume(TokenType.OpenParen, tokens);

  if (!peek(TokenType.CloseParen, tokens)) {
    pushNextExpression();

    while (peek(TokenType.Comma, tokens)) {
      consume(TokenType.Comma, tokens);
      pushNextExpression();
    }
  }

  consume(TokenType.CloseParen, tokens);

  return parameters;
}

function consume(expectedTokenType: TokenType, tokens: Token[]) {
  const token = tokens.shift();

  if (!token) {
    throw new Error(`Expected a '${TokenType[expectedTokenType]}' token, but got nothing.`);
  } else if (token.type !== expectedTokenType) {
    throw new Error(getMessageWithToken(`Expected a '${TokenType[expectedTokenType]}' token`, token));
  }

  return token;
}

function peek(expectedTokenType: TokenType, tokens: Token[], index = 0) {
  const token = tokens[index];
  return token && token.type === expectedTokenType;
}

function getMessageWithToken(expectedMessage: string, token: Token) {
  return `${expectedMessage}, but got a '${TokenType[token.type]}' token with value '${token.value}'.`;
}
