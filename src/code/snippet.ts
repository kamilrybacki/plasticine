import { CodeLine } from "@code/line";
import { CodeSnippetNotes, CodeSnippetNote } from "@code/notes";

export class CodeSnippet {
  lines: string[];
  language: string;
  notes: CodeSnippetNotes;

  private _lines: CodeLine[] = [];
  private _wasUpdated: boolean = true;

  createCodeLines(lines: string[]): CodeLine[] {
    return lines
      .map((content: string, index: number) => (
        new CodeLine(index + 1, content)
      ));
  }

  constructor(
    lines: string[],
    language: string,
    notes: CodeSnippetNotes
  ) {
    this.notes = notes;
    this.lines = lines;
    this.language = language;
  }

  static empty(): CodeSnippet {
    return new CodeSnippet([], '', new CodeSnippetNotes());
  }

  changeLanguage(newLanguage: string): void {
    this.language = newLanguage;
  };

  updateLines(newLines: string[]): void {
    this.lines = newLines;
    this._wasUpdated = true;
  };

  render(): CodeLine[] {
    if (this._wasUpdated) {
      this._lines = this.createCodeLines(this.lines);
      this._wasUpdated = false;
    }
    return this._lines;
  }

  addNote(newNote: CodeSnippetNote): number {
    return this.notes.add(newNote);
  };
};
