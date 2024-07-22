import * as dns from 'dns';
import { describe, it, expect } from '@jest/globals';
import { GoogleFonts, SatoriFontInfo, _cache } from '@renderer/fonts';
import { beforeEach } from 'node:test';

const TEST_FONT_NAMES = ['Source Code Pro', 'Roboto', 'Fira Code']
const TEST_FONT_WEIGHTS = [300, 400, 500];

namespace MockGoogleFonts {
  export const {
    clearCache,
    fetchFont,
    DEFAULT_FONT,
    DEFAULT_STYLE,
    DEFAULT_WEIGHT
  } = GoogleFonts;
  export const getDefaultFont = async (): Promise<SatoriFontInfo> => {
    return {
      name: DEFAULT_FONT,
      data: new ArrayBuffer(0)
    }
  }
}

describe('Google Fonts API adapter', () => {
  const TEST_FONT_COMBINATIONS = TEST_FONT_NAMES.flatMap((name) => {
    return TEST_FONT_WEIGHTS.map((weight) => {
      return { name, weight };
    });
  });

  beforeEach(() => {
    _cache.clearAll();
  });


  TEST_FONT_COMBINATIONS.forEach((font) => {
    it(`should be able to get a ${font.name} font @ ${font.weight} weight from Google API`, async () => {
      const fetchedFont = await MockGoogleFonts.fetchFont(font.name, font.weight);
      expect(fetchedFont).toBeDefined();
      expect(fetchedFont.name).toEqual(font.name);
      expect(fetchedFont.weight).toEqual(font.weight);
      expect(fetchedFont.data).not.toBeNull();
    });
  });

  it('should be able to clear its cache', () => {
    MockGoogleFonts.fetchFont(TEST_FONT_NAMES[0], TEST_FONT_WEIGHTS[0]);
    _cache.clearAll();
    expect(_cache.size).toBe(0);
    _cache.save('test', {} as any); 
    expect(_cache.size).toBe(1);
    MockGoogleFonts.clearCache();
    expect(_cache.size).toBe(1);
  });

  it('should be able to fetch already cached fonts', async () => {
    _cache.save(
      `https://fonts.googleapis.com/css?family=${MockGoogleFonts.DEFAULT_FONT}:${MockGoogleFonts.DEFAULT_WEIGHT}`,
      await MockGoogleFonts.getDefaultFont()
    );
    const initialFontFetch = await MockGoogleFonts.fetchFont(
      MockGoogleFonts.DEFAULT_FONT,
      MockGoogleFonts.DEFAULT_WEIGHT
    )
    await MockGoogleFonts
      .fetchFont(MockGoogleFonts.DEFAULT_FONT, MockGoogleFonts.DEFAULT_WEIGHT)
      .then((cachedFontFetch: SatoriFontInfo) => {
        expect(initialFontFetch === cachedFontFetch).toBeTruthy();
      });
  });
});
