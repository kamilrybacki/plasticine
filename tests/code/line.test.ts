import { describe, it, expect } from '@jest/globals';
import { CodeLine } from '@code/line';

describe('CodeLine', () => {
  it('should be able to create its instance', () => {
    const testContent: string = 'Hello, World!';
    const testLineNumber: number = 1;
    const testLine = new CodeLine(testLineNumber, testContent);

    expect(testLine).toBeDefined();
    expect(testLine.content).toEqual(testContent);
    expect(testLine.lineNumber).toEqual(testLineNumber);
  });
});
