import { describe, it, expect } from '@jest/globals';
import { CodeSnippetNote, CodeSnippetNotes } from '@main/markup/notes';
import { beforeEach } from 'node:test';

describe('CodeSnippetNotes', () => {
  let testNotesCache = new CodeSnippetNotes();

  beforeEach(() => testNotesCache.clear());
  
  it('should be initialized as empty map', () => {
    expect(testNotesCache.size).toEqual(0);
  });

  const currentTime = new Date();
  const testNote: CodeSnippetNote = new CodeSnippetNote(
    currentTime.getMilliseconds(),
    currentTime.toLocaleDateString()
  );

  it('should be able to UNIQUELY hash notes by their data', () => {
    expect(testNote.id).toBeGreaterThan(0);

    const anotherTestNote: CodeSnippetNote = new CodeSnippetNote(
      testNote.position,
      currentTime.toISOString()
    );

    expect(
      anotherTestNote.id
    ).not.toEqual(
      testNote.id
    );

    const yetAnotherTestNote: CodeSnippetNote = new CodeSnippetNote(
      currentTime.getHours(),
      testNote.content
    );

    expect(
      yetAnotherTestNote.id
    ).not.toEqual(
      testNote.id
    );
  });

  it('should be able to accept new notes', () => {
    const newNoteId = testNotesCache.add(testNote);
    expect(newNoteId).toBeGreaterThan(0);

    const currentNotes: Map<number, string> = testNotesCache.info;

    expect(currentNotes.keys()).toContain(testNote.position);
    expect(currentNotes.values()).toContain(testNote.content);
  });

  it('should not insert already present notes', () => {
    const noteWithStyling = new CodeSnippetNote(
      testNote.position,
      testNote.content,
      'text-xl'
    )
    const newNoteId = testNotesCache.add(noteWithStyling);
    const anotherNoteId = testNotesCache.add(noteWithStyling);
    expect(newNoteId).toEqual(anotherNoteId);
    expect(testNotesCache.size).toEqual(1);
  });
});
