import { CodeSnippetMetadata } from "@typings/code";
import { EJS } from "@renderer/templating";
import { applySyntaxHighlight } from "@renderer/markup";
import { markupToSvg } from "@renderer/markup";
import { CodeSnapshot, CodeSnippet, CodeSnippetNotes } from "@main/snippet";

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
    content: CodeSnippetMetadata
  ): Promise<CodeSnippet> {
    const highlightedCode = applySyntaxHighlight(content.code, content.language);
    return await EJS
      .render(layout, {
        code: highlightedCode,
        name: this._name,
      })
      .then((renderedMarkup: string) => {
        const newSnippet = CodeSnippet.empty();
        newSnippet.updateMetadata({
          language: content.language,
          code: renderedMarkup
        });
        return newSnippet;
      });
  }

  addNoteToSnippet(note: string, line: number, style?: string): void {
    if (this._currentFrame) {
      this._currentFrame.snippet.notes.add({
        content: note,
        line,
        style: style || ''
      });
    }
  }

};

export { Presenter };
