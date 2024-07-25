import { describe, it, expect } from '@jest/globals';
import { CodeSnapshot } from '@main/markup/snapshot';
import { CodeSnippet } from '@main/markup/snippet';

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
  });

  it('should be able to update its title', () => {
    const newTitle = 'New Title';
    const newSnapshot = CodeSnapshot.empty();

    newSnapshot.changeTitle(newTitle);
    expect(newSnapshot.title).toEqual(newTitle);
  });
});
