import * as Diff from 'diff';

export type Difference = {
  text: string
  operation: 'remove' | 'add' | 'leave'
}

export const getDifferenceBetweenSources = (before: string, after: string): Difference[] => {
  return Diff
    .diffChars(before, after)
    .map((difference: Diff.Change) => { 
      return {
        text: difference.value,
        operation: difference.added ? 'add' : difference.removed ? 'remove' : 'leave'
      } as Difference
    })
    .filter((difference: Difference) => difference.text.length > 0);
};

export const hashFromString = (source: string): number => {
  return source
    .split('')
    .reduce((hash: number, currentCharacter: string) => {
      hash ^= currentCharacter.charCodeAt(0);
      return hash;
    }, 0);
};
