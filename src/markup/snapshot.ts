import { CodeSnippet } from "@main/markup/snippet";

export type CodeSnapshotDecoration = {
  position: [number, number];
  content: string;
  style: string;
};

export class CodeSnapshot {
  title: string;
  snippet: CodeSnippet
  background: string;
  decorations: CodeSnapshotDecoration[];

  constructor(
    title: string,
    snippet: CodeSnippet,
    background: string,
    decorations: CodeSnapshotDecoration[]
  ) {
    this.title = title;
    this.snippet = snippet;
    this.background = background;
    this.decorations = decorations;
  };

  static empty(): CodeSnapshot {
    return new CodeSnapshot('', CodeSnippet.empty(), '', [])
  };

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  };
};