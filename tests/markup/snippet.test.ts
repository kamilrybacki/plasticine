import { describe, it, expect } from '@jest/globals';
import { CodeSnippet, FALLBACK_LANGUAGE } from '@main/markup/snippet';

describe('CodeSnippet', () => {
  const currentCode: string = new Date().toLocaleDateString();
  const testLanguage: string = 'python'

  it('should be able to create its empty instance', () => {
    const emptySnippet = CodeSnippet.empty();

    expect(emptySnippet).toBeDefined();
    expect(emptySnippet.language).toStrictEqual(FALLBACK_LANGUAGE);
    expect(emptySnippet.lines).toStrictEqual([]);
  });

  const makeTestSnippet = (): CodeSnippet => new CodeSnippet(
    currentCode,
    testLanguage,
  );

  it('should be able to update its language info', () => {
    const newSnippet = makeTestSnippet(); 
    const newLanguage = 'javascript';

    newSnippet.changeLanguage(newLanguage);
    expect(newSnippet.language).toEqual(newLanguage);
  });

  it("should be able to apply syntax highlighting to a code snippet", () => {
    const source = 'const name = "Satori";';
    const language = "javascript";
    const highlightedSource = CodeSnippet.applyHighlighting(source, language);

    expect(highlightedSource).toContain("const");
    expect(highlightedSource).toContain("name");
    expect(highlightedSource).toContain("Satori");
  });

  it('should be able to update its code', () => {
    const newSnippet = makeTestSnippet();
    const newCode = 'console.log("Hello, world!")';
    const expectedCode = CodeSnippet.applyHighlighting(newCode, testLanguage);

    newSnippet.update(newCode);
    const firstLine = newSnippet.render()[0];

    expect(firstLine.content).toEqual(expectedCode);
    expect(firstLine.lineNumber).toEqual(1);
  });
});
