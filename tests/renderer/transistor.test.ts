import { describe, it, expect } from '@jest/globals';
import { Diffs } from '@main/utils';
import { Transistor } from '@renderer/transistor';

describe('Transistor', () => {
  const TEST_TEXT = 'Hello, World';
  const TEST_ACCENT_CHAR = '!';

  it('should automatically create differences for before and after texts', () => {
    const transition = new Transistor(TEST_TEXT, TEST_TEXT + TEST_ACCENT_CHAR);
    expect(transition.transitions as Diffs.Difference[])
      .toEqual([
        { text: TEST_TEXT, operation: 'leave', changed: false },
        { text: TEST_ACCENT_CHAR, operation: 'add', changed: true }
      ])
  });

  [
    [ 'Hello, World', 'Hello, World!', 1 ],
    [ 'Hello, World!', 'Hello, World', 1 ],
    [ 'Hello, World', 'Hello, World!!', 2 ],
    [ 'Hello, World!!', 'Hello, World', 2 ],
    [ 'Hello, World!!', 'Hello, World!?!', 1 ],
  ].forEach(([before, after, frames]) => {
    it(`should calculate ${frames} frames for transition from "${before}" to "${after}"`, () => {
      const transition = new Transistor(before as string, after as string);
      expect(transition.totalTransitionsNeeded).toBe(frames);
    });
  });

  it('should advance through transitions', () => {
    const initialText = 'functionName(argument: ArgType): RetValType {}';
    const finalText = 'const functionName = (argument: ArgType): RetValType => {}';
    const transition = new Transistor(initialText, finalText);
    expect(transition.currentSource).toEqual(initialText);

    let transitionsCounter = 0;
    while (transitionsCounter < transition.totalTransitionsNeeded) {
      transition.next() && transitionsCounter++;
    };
    expect(transition.currentSource == finalText);
  });
});