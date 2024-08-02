import * as Diff from 'diff';

export type Difference = {
  text: string
  changed: boolean
}

export const getDifferenceBetweenSources = (before: string, after: string): Difference[] => {
  return Diff
    .diffChars(before, after)
    .map((difference: Diff.Change) => { 
      return {
        text: difference.removed ? '' : difference.value,
        changed: !!(difference.removed || difference.added)
      } as Difference
    });
};

export const hashFromString = (source: string): number => {
  return source
    .split('')
    .reduce((hash: number, currentCharacter: string) => {
      hash ^= currentCharacter.charCodeAt(0);
      return hash;
    }, 0);
};
