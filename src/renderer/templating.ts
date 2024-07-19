import ejs from 'ejs';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';

export namespace EJS {
  const loadEJSTemplateSource = async (source: string): Promise<string> => {
    return _checkIfHTMLIsValid(source) ? source : '';
  }

  const _checkIfHTMLIsValid = (source: string): boolean => {
    try {
      new JSDOM(source);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  const _render = (
    template: string,
    data: Record<string, any>
  ): string => {
    return ejs
      .render(template, data);
  }

  const loadEJSTemplateFile = async (path: string): Promise<string> => {
    return await fs.promises
      .readFile(path)
      .then((data) => data.toString());
  }

  const renderEJSTemplateFile = async (
    path: string,
    data: Record<string, any>
  ): Promise<string> => {
    const template = await loadEJSTemplateFile(path);
    return _render(template, data);
  }

  const renderEJSTemplateSource = async (
    source: string,
    data: Record<string, any>
  ): Promise<string> => {
    const template = await loadEJSTemplateSource(source);
    return _render(template, data);
  }

  export const render = async (target: string, data: Record<string, any>): Promise<string> => {
    if (path.extname(target) === '.ejs') {
      return await renderEJSTemplateFile(target, data);
    }
    return await renderEJSTemplateSource(target, data);
  }
}
