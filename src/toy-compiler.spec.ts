import { compile } from './toy-compiler';

describe('compile', () => {
  it('should compile an empty program', () => {
    expect(compile('')).toBe('');
  });

  it('should compile an empty function', () => {
    const code = 'def f() end';
    const js = 'function f() { }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that takes one parameter', () => {
    const code = 'def f(a) end';
    const js = 'function f(a) { }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that takes several parameters', () => {
    const code = 'def f(a, b, c) end';
    const js = 'function f(a, b, c) { }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function', () => {
    const code = 'def f() g() end';
    const js = 'function f() { g(); }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with one integer literal parameter', () => {
    const code = 'def f() g(1) end';
    const js = 'function f() { g(1); }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with one variable reference parameter', () => {
    const code = 'def f() g(x) end';
    const js = 'function f() { g(x); }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with a nested function call', () => {
    const code = 'def f() g(h()) end';
    const js = 'function f() { g(h()); }';

    expect(compile(code)).toBe(js);
  });

  it('should compile a function that calls another function with several different kinds of parameters', () => {
    const code = 'def f() g(x, 1, y(z)) end';
    const js = 'function f() { g(x, 1, y(z)); }';

    expect(compile(code)).toBe(js);
  });
});
