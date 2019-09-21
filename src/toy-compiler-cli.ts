#! /usr/bin/env node
import * as fs from 'fs';

import { compile } from './toy-compiler';

const [, , sourceFilePath] = process.argv;

const source = fs.readFileSync(sourceFilePath).toString();
const js = compile(source);

const library = `
// library
function log(value) { console.log(value); return value; }

function add(x, y) { return x + y; }
`;

console.log(`${js.trim()}\n\n${library.trim()}`);
