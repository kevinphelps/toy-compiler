import { add, log } from './library';

describe('library', () => {
  describe('log', () => {
    // tslint:disable-next-line no-unbound-method (not passing reference around)
    const _log = console.log;

    beforeEach(() => {
      console.log = jasmine.createSpy('log');
    });

    afterAll(() => {
      console.log = _log;
    });

    it('should log the value', () => {
      log('test');

      // tslint:disable-next-line no-unbound-method (console.log is a spy in this context)
      expect(console.log).toHaveBeenCalledWith('test');
    });

    it('should log the value exactly once', () => {
      log('test');

      // tslint:disable-next-line no-unbound-method (console.log is a spy in this context)
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should return the logged value', () => {
      expect(log('test')).toBe('test');
    });
  });

  describe('add', () => {
    it('should return the sum of the parameters', () => {
      expect(add(5, 8)).toBe(13);
    });
  });
});
