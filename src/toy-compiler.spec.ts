import { compile } from './toy-compiler';

describe('compile', () => {
  it('should compile an empty program', () => {
    expect(compile('')).toEqual('\n');
  });

  it('should compile an empty function', () => {
    const code = 'def f() end';
    const js = 'function f() { }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that takes one parameter', () => {
    const code = 'def f(a) end';
    const js = 'function f(a) { }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that takes several parameters', () => {
    const code = 'def f(a, b, c) end';
    const js = 'function f(a, b, c) { }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function', () => {
    const code = 'def f() g() end';
    const js = 'function f() { g(); }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with one integer literal parameter', () => {
    const code = 'def f() g(1) end';
    const js = 'function f() { g(1); }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with one variable reference parameter', () => {
    const code = 'def f() g(x) end';
    const js = 'function f() { g(x); }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with a nested function call', () => {
    const code = 'def f() g(h()) end';
    const js = 'function f() { g(h()); }\n';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with several different kinds of parameters', () => {
    const code = 'def f() g(x, 1, y(z)) end';
    const js = 'function f() { g(x, 1, y(z)); }\n';

    expect(compile(code)).toBe(js);
  });
});
