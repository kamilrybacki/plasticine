import { describe, it, expect } from '@jest/globals';
import { hashFromString, Diffs } from '@main/utils';

describe('Hashing from string', () => {
  const TEST_STRING = new Date().toUTCString();
  it('should be able to create unique hashes', () => {
    expect(
      hashFromString(TEST_STRING)
    ).toEqual(
      hashFromString(TEST_STRING)
    );
    expect(
      hashFromString(TEST_STRING)
    ).not.toEqual(
      hashFromString(new Date().toString())
    );
  });
});

describe('Differences between texts', () => {
  const TEST_TEXT = 'Hello, World';
  const TEST_ACCENT_CHAR = '!';

  it('should return empty array for unchanged text', () => {
    const sameTextDifferences = Diffs.getDifferences(TEST_TEXT, TEST_TEXT);
    expect(sameTextDifferences.length).toEqual(1);
    expect(sameTextDifferences.slice(-1).pop()?.text).toEqual(TEST_TEXT);
  });

  const checkDifferences = (
    firstText: string,
    secondText: string,
    expectedLength: number,
    expectedAccentCharacterPosition: number
  ) => {
    const differences = Diffs.getDifferences(firstText, secondText);
    expect(differences.length).toEqual(expectedLength);
    expect(
      differences
        .at(expectedAccentCharacterPosition)?.text
        .trim()
    ).toEqual(TEST_ACCENT_CHAR);
  };

  it('should return differences between the ends of the text', () => {
    checkDifferences(TEST_TEXT, TEST_TEXT + TEST_ACCENT_CHAR, 2, -1);
  });

  it('should return differences between the beginnings of the text', () => {
    checkDifferences(TEST_TEXT, TEST_ACCENT_CHAR + TEST_TEXT, 2, 0);
  });

  it('should return differences between the middle of the text', () => {
    checkDifferences(TEST_TEXT, TEST_TEXT.slice(0, 5) + TEST_ACCENT_CHAR + TEST_TEXT.slice(5), 3, 1);
  });

  it('should support multiline text', () => {
    const multilineBeforeText = `
      ${TEST_TEXT}
      ${TEST_TEXT}
      ${TEST_TEXT}
    `;
    const multilineAfterText = `
      ${TEST_TEXT}
      ${TEST_ACCENT_CHAR}
      ${TEST_TEXT}
    `;
    checkDifferences(multilineBeforeText, multilineAfterText, 4, 2);
    const anotherMultilineAfterText = `
      ${TEST_TEXT}
      ${TEST_TEXT}
      ${TEST_ACCENT_CHAR}
      ${TEST_TEXT}
    `;
    checkDifferences(multilineBeforeText, anotherMultilineAfterText, 3, 1);
  });
});
