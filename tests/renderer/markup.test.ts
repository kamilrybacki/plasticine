import { markupToSvg } from "@renderer/markup";
import {
    describe,
    it,
    expect,
} from '@jest/globals';
import { GoogleFonts } from "@renderer/styling/fonts";
import { SatoriFontInfo } from "@typings/style";

const TEST_MARKUP_CONTENT = '<h1>Hello, World!</h1>';
const TEST_SVG_DIMENSIONS = { width: 100, height: 100 };

describe('Markup to SVG conversion', () => {
    it('should be able to convert markup to SVG', async () => {
      const renderedSVG: SVGElement = await GoogleFonts
        .getDefaultFont()
        .then(async (fetchedFont: SatoriFontInfo) => {
          return await markupToSvg(
            TEST_MARKUP_CONTENT,
            TEST_SVG_DIMENSIONS,
            [fetchedFont]
          );
        });
      expect(renderedSVG).toBeDefined();
      expect(renderedSVG.tagName).toBe('svg');
      const svgAttributes = renderedSVG.attributes;

      Object.keys(TEST_SVG_DIMENSIONS).forEach((attributeName: string) => {
        expect(svgAttributes.getNamedItem(attributeName)).toBeDefined();
        expect(svgAttributes.getNamedItem(attributeName)?.value).toBe(
          `${TEST_SVG_DIMENSIONS[attributeName as keyof typeof TEST_SVG_DIMENSIONS]}`
        )
      });
    });
});
