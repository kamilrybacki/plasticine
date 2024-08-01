import { describe, it, expect } from '@jest/globals';
import { hashFromString, getDifferenceBetweenSources } from '@main/utils';

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
    const sameTextDiff = getDifferenceBetweenSources(TEST_TEXT, TEST_TEXT);
    expect(sameTextDiff.length).toEqual(1);
    expect(sameTextDiff.pop()?.[0]).toEqual(TEST_TEXT);
  });

  it('should return differences between the ends of the text', () => {
    const newText = TEST_TEXT + TEST_ACCENT_CHAR;
    const diff = getDifferenceBetweenSources(TEST_TEXT, newText);
    expect(diff.length).toEqual(2);
    expect(diff.pop()?.[0]).toEqual(TEST_ACCENT_CHAR);
  });

  it('should return differences between the beginnings of the text', () => {
    const newText = TEST_ACCENT_CHAR + TEST_TEXT;
    const diff = getDifferenceBetweenSources(TEST_TEXT, newText);
    expect(diff.length).toEqual(2);
    expect(diff.pop()?.[0]).toEqual(TEST_TEXT);
  });
});
