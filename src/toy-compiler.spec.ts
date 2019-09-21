import { compile } from './toy-compiler';

describe('compile', () => {
  it('should work', () => {
    expect(compile('')).toBe('');
  });
});
