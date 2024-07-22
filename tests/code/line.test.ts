import { describe, it, expect } from '@jest/globals';
import { CodeLine, DEFAULT_SPACES_PER_INDENT } from '@code/line';

const TEST_INDENTED_LINE_CASES = {
  ' BEGIN': 0,
  '  BEGIN': 1,
  '   BEGIN': 1,
  '    BEGIN': 2,
  '          BEGIN': 5
};

describe('CodeLine', () => {
  const testContent: string = 'Hello, World!';

  it('should be able to create its instance', () => {
    const testLineNumber: number = 1;
    const testLine = new CodeLine(testLineNumber, testContent);

    expect(testLine).toBeDefined();
    expect(testLine.content).toEqual(testContent);
    expect(testLine.lineNumber).toEqual(testLineNumber);
  });

  it('should hash the same content differently for different line numbers', () => {
    const testLineNumbers = [...Array(10).keys()];
    const testLines = testLineNumbers.map(
      (lineNumber) => new CodeLine(lineNumber, testContent)
    );
    const testLinesIds = testLines.map((line) => line.id);

    expect(testLinesIds).toEqual(
      [...new Set(testLinesIds)]
    );
  });

  Object
    .entries(TEST_INDENTED_LINE_CASES)
    .forEach((sample: [string, number]) => {
      it(`should correctly calculate indents for: ${sample[0]} (${sample[1]})`, () => {
        const calculatedValue = CodeLine.calculateIndents(
          sample[0], DEFAULT_SPACES_PER_INDENT
        )
        expect(calculatedValue).toEqual(sample[1]);
      });
    });
  
  it('should apply new intentation to line content', () => {
    const text = "It's my line"
    const newLine = new CodeLine(1, `  ${text}`);
    newLine.setIndentSize(4);
    expect(newLine.content).toEqual(`    ${text}`);
    expect(newLine.lineNumber).toEqual(1);
  })
});
