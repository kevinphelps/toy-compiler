import { add, log } from './library';

describe('library', () => {
  describe('log', () => {
    it('should return the logged value', () => {
      expect(log(5)).toBe(5);
    });
  });

  describe('add', () => {
    it('should return the sum of the parameters', () => {
      expect(add(5, 8)).toBe(13);
    });
  });
});
