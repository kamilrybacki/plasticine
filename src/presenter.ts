import { EJS } from "@markup/ejs";
import { CodeSnippet } from "@main/markup/snippet";

const DEFAULT_CODE_SNIPPET_LAYOUT = 'templates/code.ejs';

class Presenter {
  frames: string[];
  currentFrame: string;
  name: string;

  constructor(name: string) {
    this.name = name;
    this.frames = [];
    this.currentFrame = '';
  };

  addFrame(source: string, language: string): void {};

  async render(
    layout: string = DEFAULT_CODE_SNIPPET_LAYOUT,
    source: string,
    language: string
  ): Promise<string> {
    return await EJS
      .render(layout, {
        code: new CodeSnippet(source, language).lines,
        name: this.name,
      });
  };
};

export { Presenter };
