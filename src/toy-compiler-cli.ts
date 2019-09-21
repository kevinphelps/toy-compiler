#! /usr/bin/env node
import * as fs from 'fs';

import { compile } from './toy-compiler';

const [, , sourceFilePath] = process.argv;

const source = fs.readFileSync(sourceFilePath).toString();

console.log(compile(source));
