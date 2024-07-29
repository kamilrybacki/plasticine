import { Markup, SVG } from "@renderer/converters";
import { describe, it, expect } from '@jest/globals';
import { GoogleFonts, SatoriFontInfo } from "@renderer/fonts";
import { JSDOM } from 'jsdom';
import * as fs from 'fs';

const TEST_MARKUP_CONTENT = '<h1>Hello, World!</h1>';
const TEST_SVG_DIMENSIONS = { width: 100, height: 100 };

describe('Markup converters', () => {
    it('should be able to convert HTML markup to SVG', async () => {
      const renderedSVG: SVGElement = await GoogleFonts
        .getDefaultFont()
        .then(async (fetchedFont: SatoriFontInfo) => {
          return await Markup.toSVG(
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

// describe('SVG converters', () => {
//   const TEST_SVG = fs.readFileSync('tests/assets/test.svg', 'utf-8');
//   const DOM = new JSDOM(TEST_SVG);

//   it('should be able to convert to data URL', () => {
//     const svgElement = DOM.window.document.querySelector('svg') as SVGElement;
    
//     const svgDimensions = {
//       width: parseInt(svgElement.getAttribute('width') || '0'),
//       height: parseInt(svgElement.getAttribute('height') || '0')
//     };
//     const dataURL = SVG.toDataURL(svgElement);
//     expect(dataURL).toBeDefined();
//     expect(dataURL.startsWith('data:image/svg+xml,')).toBeTruthy();

//     const imageWithSVG = new Image();
//     imageWithSVG.src = dataURL;
//     expect(imageWithSVG).toBeDefined();
//     expect(imageWithSVG.width).toBe(svgDimensions.width);
//     expect(imageWithSVG.height).toBe(svgDimensions.height);
//   });
// });
