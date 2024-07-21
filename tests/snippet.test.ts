import {
    describe,
    it,
    expect,
} from '@jest/globals';
import { CodeSnapshot, CodeSnippet, CodeSnippetNotes } from '@main/snippet';
import { CodeSnippetMetadata, CodeSnippetNote } from '@typings/code';
import { beforeEach } from 'node:test';

describe('CodeSnippetNotes', () => {
  let testNotesCache = new CodeSnippetNotes();

  beforeEach(() => testNotesCache.clear());
  
  it('should be initialized as empty map', () => {
    expect(testNotesCache.size).toEqual(0);
  });

  const currentTime = new Date();
  const testNote: CodeSnippetNote = {
    line: currentTime.getMilliseconds(),
    content: currentTime.toLocaleDateString()
  };

  it('should be able to UNIQUELY hash notes by their data', () => {
    const firstHash = testNotesCache.hash(testNote);
    expect(firstHash).toBeGreaterThan(0);

    const secondHash = testNotesCache.hash(testNote);
    expect(secondHash).toEqual(firstHash);

    const anotherTestNote: CodeSnippetNote = {
      ...testNote,
      content: currentTime.toISOString()
    }

    const thirdHash = testNotesCache.hash(anotherTestNote);
    expect(thirdHash).not.toEqual(firstHash);

    const yetAnotherTestNote: CodeSnippetNote = {
      ...testNote,
      line: currentTime.getHours()
    }

    const finalHash = testNotesCache.hash(yetAnotherTestNote);
    expect(finalHash).not.toEqual(firstHash);
  });

  it('should be able to accept new notes', () => {
    const newNoteId = testNotesCache.add(testNote);
    expect(newNoteId).toBeGreaterThan(0);

    const currentNotes: Map<number, string> = testNotesCache.info;

    expect(currentNotes.keys()).toContain(testNote.line);
    expect(currentNotes.values()).toContain(testNote.content);
  });

  it('should not insert already present notes', () => {
    const noteWithStyling = {
      ...testNote,
      style: 'text-xl'
    }
    const newNoteId = testNotesCache.add(noteWithStyling);
    const anotherNoteId = testNotesCache.add(noteWithStyling);
    expect(newNoteId).toEqual(anotherNoteId);
    expect(testNotesCache.size).toEqual(1);
  })
});

describe('CodeSnippet', () => {
  const currentTime: string = new Date().toLocaleDateString();
  const testMetadata: CodeSnippetMetadata = {
    language: 'python',
    code: currentTime
  };

  it('should be able to create its empty instance', () => {
    const emptySnippet = CodeSnippet.empty();

    expect(emptySnippet).toBeDefined();
    expect(emptySnippet.metadata).toStrictEqual({
      language: '',
      code: ''
    });
    expect(emptySnippet.notes.size).toEqual(0);
  });

  const makeTestSnippet = (): CodeSnippet => new CodeSnippet(
    testMetadata,
    new CodeSnippetNotes()
  );

  it('should be able to update its language info', () => {
    const newSnippet = makeTestSnippet(); 
    const newLanguage = 'javascript';

    newSnippet.updateMetadata({ language: newLanguage });

    expect(newSnippet.metadata.code).toEqual(testMetadata.code);
    expect(newSnippet.metadata.language).toEqual(newLanguage);
  });

  it('should be able to update its code', () => {
    const newSnippet = makeTestSnippet();
    const newCode = 'console.log("Hello, world!")';

    newSnippet.updateMetadata({ code: newCode });

    expect(newSnippet.metadata.code).toEqual(newCode);
    expect(newSnippet.metadata.language).toEqual(testMetadata.language);
  })
});

describe('CodeSnapshot', () => {
  it('should be able to create its empty instance', () => {
    const emptySnapshot = CodeSnapshot.empty();
    
    expect(emptySnapshot).toBeDefined();
    expect(emptySnapshot.title).toEqual('');
    expect(emptySnapshot.background).toEqual('');
    expect(emptySnapshot.decorations).toEqual([]);
    expect(emptySnapshot.snippet).toStrictEqual(
      CodeSnippet.empty()
    );
  })
})