import { EJS } from "@markup/ejs";
import { CodeSnapshot } from "@main/markup/snapshot";
import { CodeSnippet } from "@main/markup/snippet";

const DEFAULT_CODE_SNIPPET_LAYOUT = 'templates/code.ejs';

class Presenter {
  private _name: string;
  private _snapshots: CodeSnapshot[];
  private _currentFrame: CodeSnapshot;

  constructor(name: string) {
    this._name = name;
    this._snapshots = [];
    this._currentFrame = CodeSnapshot.empty();
  }

  get name(): string {
    return this._name;
  }

  get frames(): CodeSnapshot[] {
    return this._snapshots;
  }

  next(): void {
    this._snapshots.push(this._currentFrame);
    this._currentFrame = CodeSnapshot.empty();
  }

  async renderSnippet(
    layout: string = DEFAULT_CODE_SNIPPET_LAYOUT,
    source: string,
    language: string
  ): Promise<CodeSnippet> {
    const highlightedCode = CodeSnippet.applyHighlighting(source, language);
    return await EJS
      .render(layout, {
        code: highlightedCode,
        name: this._name,
      })
      .then((renderedMarkup: string) => {
        return CodeSnippet.empty();
      });
  }
};

export { Presenter };
