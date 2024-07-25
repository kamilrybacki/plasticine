import satori from 'satori';
import { html } from 'satori-html';
import { JSDOM } from 'jsdom';
import { SatoriFontInfo } from '@renderer/fonts';

export const markupToSvg = async (
  markup: string,
  size: { width: number; height: number },
  fonts: SatoriFontInfo[]
): Promise<SVGElement> => {
  return satori(html`${markup}`, {
    width: size.width,
    height: size.height,
    fonts: fonts as SatoriFontInfo[],
  })
    .then((svgSource: string) => {
      return new JSDOM(svgSource)
        .window.document
        .querySelector('svg') as SVGElement;
    });
};
