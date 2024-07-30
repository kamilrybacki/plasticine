import satori from 'satori';
import { html } from 'satori-html';
import { JSDOM } from 'jsdom';
import { SatoriFontInfo } from '@renderer/fonts';
import { createCanvas, Image } from 'canvas';

export namespace Markup {
  export const toSVG = async (
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
  }
};

export namespace SVG {
  export const toDataURL = (svg: SVGElement): string => {
    return `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`;
  }

  export const toPNG = async (svg: SVGElement): Promise<Buffer> => {
    const canvas = createCanvas(
      parseInt(svg.getAttribute('width') || '0'),
      parseInt(svg.getAttribute('height') || '0')
    );
    const svgAsImage = new Image();
    svgAsImage.src = toDataURL(svg);
    canvas
      .getContext('2d')
      .drawImage(svgAsImage, 0, 0);
    return canvas.toBuffer();
  }
};
