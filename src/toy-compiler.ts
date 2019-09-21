import { generate } from './generator/generate';
import { parse } from './parser/parse';
import { tokenize } from './tokenizer/tokenize';

export function compile(source: string) {
  return generate(parse(tokenize(source)));
}
