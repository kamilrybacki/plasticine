
export const hashFromString = (source: string): number => {
  return source
    .split('')
    .reduce((hash: number, currentCharacter: string) => {
      hash ^= currentCharacter.charCodeAt(0);
      return hash;
    }, 0);
};
