/* istanbul ignore file */

export abstract class ParseNode {
  readonly __parse: never;
}

export abstract class ExpressionNode extends ParseNode {
  readonly __expression: never;
}

export class DefNode extends ParseNode {
  readonly __def: never;

  constructor(readonly name: string, readonly parameterNames: string[], readonly body: ExpressionNode) {
    super();
  }
}

export class IntegerLiteralNode extends ExpressionNode {
  readonly __integer: never;

  constructor(readonly value: number) {
    super();
  }
}

export class FunctionCallNode extends ExpressionNode {
  readonly __functionCall: never;

  constructor(readonly name: string, readonly parameters: ExpressionNode[]) {
    super();
  }
}

export class VariableReferenceNode extends ExpressionNode {
  readonly __variableReference: never;

  constructor(readonly name: string) {
    super();
  }
}
