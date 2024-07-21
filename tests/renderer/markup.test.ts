import { applySyntaxHighlight, markupToSvg } from "@renderer/markup";
import { describe, it, expect } from '@jest/globals';
import { GoogleFonts, SatoriFontInfo } from "@renderer/fonts";

const TEST_MARKUP_CONTENT = '<h1>Hello, World!</h1>';
const TEST_SVG_DIMENSIONS = { width: 100, height: 100 };

describe('Markup to SVG converter', () => {
    it('should be able to convert HTML markup to SVG', async () => {
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

describe("Highlighter module", () => {
  it("should be able to apply syntax highlighting to a code snippet", () => {
    const source = `const name = "Satori";`;
    const language = "javascript";
    const highlightedSource = applySyntaxHighlight(source, language);
    expect(highlightedSource).toContain("const");
    expect(highlightedSource).toContain("name");
    expect(highlightedSource).toContain("Satori");
  });
});
