import { CodeSnapshotDecoration, CodeSnippetMetadata, CodeSnippetNote } from "@typings/code";

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
  }

  static empty(): CodeSnapshot {
    return new CodeSnapshot('', CodeSnippet.empty(), '', [])
  }
};

export class CodeSnippetNotes {
  notes: Map<number, CodeSnippetNote> = new Map();

  get size(): number {
    return this.notes.size;
  }

  hash(note: CodeSnippetNote): number {
    return `${note.line}${note.content}`
      .split('')
      .reduce((hash: number, currentCharacter: string) => {
        hash ^= currentCharacter.charCodeAt(0);
        return hash;
      }, 0);
  }

  add(note: CodeSnippetNote, update: boolean = false): number {
    const currentNoteHash = this.hash(note);
    if (!this.notes.has(currentNoteHash)) {
      this.notes.set(currentNoteHash, note);
    } else {
      update
        ? this.notes.set(currentNoteHash, note)
        : console.log(`Note ${currentNoteHash} is already stored!`)
    }
    return currentNoteHash;
  }

  delete(target: CodeSnippetNote | number): boolean {
    return this.notes.delete(
      typeof target === 'number'
        ? target
        : this.hash(target)
    );
  };

  clear(): void {
    this.notes = new Map<number, CodeSnippetNote>();
  }

  get info(): Map<number, string> {
    return [...this.notes.values()]
      .reduce((info: Map<number, string>, currentNote: CodeSnippetNote) => {
        info.set(currentNote.line, currentNote.content)
        return info;
      }, new Map<number, string>())
  };
}

export class CodeSnippet {
  metadata: CodeSnippetMetadata;
  notes: CodeSnippetNotes;

  constructor(
    metadata: CodeSnippetMetadata,
    notes: CodeSnippetNotes
  ) {
    this.metadata = metadata;
    this.notes = notes;
  }

  static empty(): CodeSnippet {
    return new CodeSnippet({
      language: '',
      code: ''
    }, new CodeSnippetNotes());
  }

  updateMetadata(newData: Partial<CodeSnippetMetadata>): void {
    this.metadata = {
      language: newData.language || this.metadata.language,
      code: newData.code || this.metadata.code
    }
  }
};
