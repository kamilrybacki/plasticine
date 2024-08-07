import { EJS } from "@markup/ejs";
import { CodeSnippet } from "@main/markup/snippet";

const DEFAULT_CODE_SNIPPET_LAYOUT = 'templates/code.ejs';

export default class Presenter {
  name: string;
  frames: string[] = [];
  readonly layout: string;

  constructor(
    name: string,
    layout: string = DEFAULT_CODE_SNIPPET_LAYOUT
  ) {
    this.name = name;
    this.layout = layout;
  };

  async addFrame(source: string, language: string): Promise<void> {
    const renderedFrame = await this.render(source, language);
    this.frames.push(renderedFrame);
  };

  async render(source: string, language: string): Promise<string> {
    return await EJS
      .render(this.layout, {
        code: new CodeSnippet(source, language).lines,
        name: this.name,
      });
  };
};
