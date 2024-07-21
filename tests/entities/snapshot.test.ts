import { describe, it, expect } from '@jest/globals';
import { CodeSnapshot } from '@code/snapshot';
import { CodeSnippet } from '@code/snippet';

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
});
