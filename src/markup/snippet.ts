import hljs from "highlight.js";
import { CodeLine } from "@main/markup/line";

export const FALLBACK_LANGUAGE = 'plaintext';

export class CodeSnippet {
  lines: string[];
  language: string;

  private _lines: CodeLine[] = [];
  private _wasUpdated: boolean = true;

  constructor(
    source: string,
    language: string,
  ) {
    this.lines = source.trim().length > 0 ? CodeSnippet
      .applyHighlighting(source, language)
      .split('\n') : [];
    this.language = language;
  };

  static applyHighlighting = (
    source: string,
    language: string
  ): string => {
    return hljs
      .highlight(
        source,
        { language: language }
      )
      .value;
  };

  static empty(): CodeSnippet {
    return new CodeSnippet('', FALLBACK_LANGUAGE);
  };

  changeLanguage(newLanguage: string): void {
    this.language = newLanguage;
  };

  update(newSource: string): void {
    this.lines = CodeSnippet
      .applyHighlighting(newSource, this.language || FALLBACK_LANGUAGE)
      .split('\n');
    this._wasUpdated = true;
  };

  render(): CodeLine[] {
    if (this._wasUpdated) {
      this._lines = this.createCodeLines(this.lines);
      this._wasUpdated = false;
    }
    return this._lines;
  }

  createCodeLines(lines: string[]): CodeLine[] {
    return lines
      .map((content: string, index: number) => (
        new CodeLine(index + 1, content)
      ));
  }
};
