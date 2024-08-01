import * as Diff from 'diff';

export const getDifferenceBetweenSources = (before: string, after: string): [string, number][] => {
  return Diff
    .diffChars(before, after)
    .map((difference: Diff.Change) => [
      difference.removed ? '' : difference.value,
      (difference.removed || difference.added) ? 1 : 0
    ])
};

export const hashFromString = (source: string): number => {
  return source
    .split('')
    .reduce((hash: number, currentCharacter: string) => {
      hash ^= currentCharacter.charCodeAt(0);
      return hash;
    }, 0);
};
