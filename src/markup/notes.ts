import { CodeLineHash } from "@main/markup/line";
import { hashFromString } from "@main/utils";

export type CodeSnippetNoteHash = number;
export const isNoteHash = (hash: any): hash is CodeSnippetNoteHash => typeof hash === 'number';

export class CodeSnippetNote {
  id: CodeSnippetNoteHash;
  position: CodeLineHash;
  content: string;
  style?: string;

  constructor(
    position: CodeLineHash,
    content: string,
    style?: string
  ) {
    this.position = position;
    this.content = content;
    this.style = style;
    this.id = hashFromString(`${position}${content}`);
  }
};

export class CodeSnippetNotes {
  notes: Map<CodeSnippetNoteHash, CodeSnippetNote> = new Map();
  positions: Map<CodeLineHash, CodeSnippetNoteHash> = new Map();

  get size(): number {
    return this.notes.size;
  }

  add(
    note: CodeSnippetNote,
    update: boolean = false
  ): number {
    if (!this.notes.has(note.id)) {
      this.notes.set(note.id, note);
      this.positions.set(note.position, note.id);
    } else {
      update && this.notes.set(note.id, note);
    }
    return note.id;
  }

  delete(target: CodeSnippetNote | CodeSnippetNoteHash): boolean {
    const noteId = isNoteHash(target) ? target : target.id;
    const positionId = isNoteHash(target)
      // @ts-ignore
      ? this.notes.get(target).position
      : target.position;

    return this.notes.delete(noteId) && this.positions.delete(positionId);
  };

  clear(): void {
    this.notes = new Map<CodeSnippetNoteHash, CodeSnippetNote>();
    this.positions = new Map<CodeLineHash, CodeSnippetNoteHash>();
  }

  get info(): Map<number, string> {
    return [...this.notes.values()]
      .reduce((info: Map<number, string>, currentNote: CodeSnippetNote) => {
        info.set(currentNote.position, currentNote.content)
        return info;
      }, new Map<number, string>())
  };
};
