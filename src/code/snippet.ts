import { CodeLine } from "@code/line";
import { CodeSnippetNotes, CodeSnippetNote } from "@code/notes";

export class CodeSnippet {
  lines: CodeLine[];
  language: string;
  notes: CodeSnippetNotes;

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
    this.lines = this.createCodeLines(lines);
    this.language = language;
  }

  static empty(): CodeSnippet {
    return new CodeSnippet([], '', new CodeSnippetNotes());
  }

  changeLanguage(newLanguage: string): void {
    this.language = newLanguage;
  };

  updateLines(newLines: string[]): void {
    this.lines = this.createCodeLines(newLines);
  };

  addNote(newNote: CodeSnippetNote): number {
    return this.notes.add(newNote);
  };
};
