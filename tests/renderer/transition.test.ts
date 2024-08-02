import { describe, it, expect } from '@jest/globals';
import { Difference } from '@main/utils';
import { Transition } from '@renderer/transition';

describe('Transition', () => {
  const TEST_TEXT = 'Hello, World';
  const TEST_ACCENT_CHAR = '!';

  it('should automatically create differences for before and after texts', () => {
    const transition = new Transition(TEST_TEXT, TEST_TEXT + TEST_ACCENT_CHAR);
    expect(transition.diff as Difference[])
      .toEqual([
        { text: TEST_TEXT, changed: false },
        { text: TEST_ACCENT_CHAR, changed: true }
      ])
  });
});