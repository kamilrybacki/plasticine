import satori from 'satori';
import { html } from 'satori-html';
import { JSDOM } from 'jsdom';
import { SatoriFontInfo } from '@renderer/fonts';

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

  export const toPNG = async (svg: SVGElement): Promise<string> => {
    const canvas = new JSDOM().window.document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = parseInt(svg.getAttribute('width') || '0');
    canvas.height = parseInt(svg.getAttribute('height') || '0');

    const image = new Image();
    image.src = toDataURL(svg);

    return new Promise((resolve) => {
      image.onload = () => {
        context?.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      }
    });
  }
};
