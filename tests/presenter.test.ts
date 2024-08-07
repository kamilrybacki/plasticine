import { describe, it, expect } from '@jest/globals';
import Presenter from '@main/presenter';

describe('Presenter structure', () => {
    const presenter = new Presenter('John Doe');
    it('should have a name', () => expect(presenter.name).toBe('John Doe'));
    it('should have code snapshot frames', () => expect(presenter.snapshots).toEqual([]));
});
