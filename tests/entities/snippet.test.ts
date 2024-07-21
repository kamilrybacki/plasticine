import { describe, it, expect } from '@jest/globals';
import { CodeSnippet } from '@code/snippet';
import { CodeSnippetNotes } from '@code/notes';

describe('CodeSnippet', () => {
  const currentTime: string = new Date().toLocaleDateString();
  const testLanguage: string = 'python'
  const currentCode: string = currentTime;

  it('should be able to create its empty instance', () => {
    const emptySnippet = CodeSnippet.empty();

    expect(emptySnippet).toBeDefined();
    expect(emptySnippet.language).toStrictEqual('');
    expect(emptySnippet.lines).toStrictEqual([]);
    expect(emptySnippet.notes.size).toEqual(0);
  });

  const makeTestSnippet = (): CodeSnippet => new CodeSnippet(
    [currentCode],
    testLanguage,
    new CodeSnippetNotes()
  );

  it('should be able to update its language info', () => {
    const newSnippet = makeTestSnippet(); 
    const newLanguage = 'javascript';

    newSnippet.changeLanguage(newLanguage);
    expect(newSnippet.language).toEqual(newLanguage);
  });

  it('should be able to update its code', () => {
    const newSnippet = makeTestSnippet();
    const newCode = 'console.log("Hello, world!")';

    newSnippet.updateLines([newCode]);
    const firstLine = newSnippet.lines[0];

    expect(firstLine.content).toEqual(newCode);
    expect(firstLine.lineNumber).toEqual(1);
  });
});
