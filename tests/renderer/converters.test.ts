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

describe('SVG converters', () => {
  const FIRST_EIGHT_BYTES_OF_PNG = 'iVBORw0KGgo=';
  const TEST_SVG_PNG_SOURCE = fs.readFileSync('tests/assets/test.png', 'base64');
  const TEST_SVG_SOURCE = fs.readFileSync('tests/assets/test.svg', 'utf-8');
  const TEST_SVG = new JSDOM(TEST_SVG_SOURCE)
    .window.document
    .querySelector('svg') as SVGElement;

  it('should be able to convert to data URL', () => {
    const dataURL = SVG.toDataURL(TEST_SVG);
    expect(dataURL).toBeDefined();
    expect(dataURL.startsWith('data:image/svg+xml,')).toBeTruthy();

    const decodedDataURLContent = decodeURIComponent(
      dataURL.split(',')[1]
    );
    const decodedSVGElement = new JSDOM(decodedDataURLContent)
      .window.document
      .querySelector('svg') as SVGElement;

    const isDimensionDifferenceZero = ['width', 'height']
      .map((dimensionName: string) => {
        const decoded = parseInt(
          decodedSVGElement.getAttribute(dimensionName) || '0'
        );
        const original = parseInt(
          TEST_SVG.getAttribute(dimensionName) || '1'
        );
        return decoded - original;
      })
      .every((difference: number) => difference == 0);
    expect(isDimensionDifferenceZero).toBeTruthy();
    expect(TEST_SVG.innerHTML).toEqual(decodedSVGElement.innerHTML);
  });

  it('should be able to convert to PNG', async () => {
    const convertedSVG = await SVG.toPNG(TEST_SVG);
    const firstEightBytes = Buffer
      .from(convertedSVG, 'base64')
      .subarray(0, 8)
      .toString('base64');
    expect(firstEightBytes).toEqual(FIRST_EIGHT_BYTES_OF_PNG);

    const originalSourceBytes = Buffer.from(TEST_SVG_PNG_SOURCE);
    const convertedSVGBytes = Buffer.from(convertedSVG);

    expect(originalSourceBytes.length).toEqual(convertedSVGBytes.length);
    expect(
      originalSourceBytes.equals(convertedSVGBytes)
    ).toBeTruthy();
  });
});
