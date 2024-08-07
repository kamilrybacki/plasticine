import { CodeSnippet } from "@main/markup/snippet";

export class CodeSnapshot {
  title: string;
  snippet: CodeSnippet
  background: string;

  constructor(
    title: string,
    snippet: CodeSnippet,
    background: string,
  ) {
    this.title = title;
    this.snippet = snippet;
    this.background = background;
  };

  static empty(): CodeSnapshot {
    return new CodeSnapshot('', CodeSnippet.empty(), '');
  };

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  };
};
