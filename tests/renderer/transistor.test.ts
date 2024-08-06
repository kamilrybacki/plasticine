import { describe, it, expect } from '@jest/globals';
import { Diffs } from '@main/utils';
import { Transistor } from '@renderer/transistor';

describe('Transistor', () => {
  const TEST_TEXT = 'Hello, World';
  const TEST_ACCENT_CHAR = '!';

  it('should automatically create differences for before and after texts', () => {
    const transistor = new Transistor(TEST_TEXT, TEST_TEXT + TEST_ACCENT_CHAR);
    expect(transistor.transitions as Diffs.Difference[])
      .toEqual([
        { text: TEST_TEXT, operation: 'leave', changed: false},
        { text: TEST_ACCENT_CHAR, operation: 'add', changed: true}
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
      const transistor = new Transistor(before as string, after as string);
      expect(transistor.totalTransitionsNeeded).toBe(frames);
    });
  });

  const expectedTransitionsResults: string[] = [
    'functionName(argument: ArgType): RetValType {}',
    'c functionName(argument: ArgType): RetValType {}',
    'co functionName(argument: ArgType): RetValType {}',
    'con functionName(argument: ArgType): RetValType {}',
    'cons functionName(argument: ArgType): RetValType {}',
    'const functionName(argument: ArgType): RetValType {}',
  ]

  it('should advance through transitions', () => {
    const initialText = 'functionName(argument: ArgType): RetValType {}';
    const finalText = 'const functionName = (argument: ArgType): RetValType => {}';
    const transistor = new Transistor(initialText, finalText);
    expect(transistor.currentSource).toEqual(initialText);
  });

  it('should advance through all transitions', () => {
    const initialText = 'functionName(argument: ArgType): RetValType {}';
    const finalText = 'const functionName = (argument: ArgType): RetValType => {}';
    const transistor = new Transistor(initialText, finalText);
    expect(transistor.currentSource).toEqual(initialText);

    let transitionsCounter = 0;
    while (transitionsCounter <= transistor.totalTransitionsNeeded) {
      transistor.next();
      transitionsCounter++;
    };
    expect(transistor.currentSource).toEqual(finalText);
  });
});