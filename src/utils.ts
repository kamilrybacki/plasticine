import * as Diff from 'diff';

export namespace Diffs {
  export type Operation = 'remove' | 'add' | 'leave';

  export class Difference {
    text: string
    operation: Operation
    changed: boolean

    constructor(change: Diff.Change) {
      this.text = change.value;
      this.operation = change.added ? 'add' : change.removed ? 'remove' : 'leave';
      this.changed = this.operation != 'leave';
    }

    nullify(): void {
      this.changed = false;
      this.operation = 'leave';
    };
  };

  export const fromDict = (text: string, operation: Operation): Difference => {
    const optionalChangeAttributes = operation == 'remove' ? { removed: true } : operation == 'add' ? { added: true } : {};
    return new Difference({
      count: text.length,
      value: text,
      ...optionalChangeAttributes
    } as Diff.Change);
  };

  export const getDifferences = (before: string, after: string): Difference[] => {
    return Diff
      .diffChars(before, after)
      .map((change: Diff.Change) => new Difference(change))
      .filter((difference: Difference) => difference.text.length > 0);
  };
};

export const hashFromString = (source: string): number => {
  return source
    .split('')
    .reduce((hash: number, currentCharacter: string) => {
      hash ^= currentCharacter.charCodeAt(0);
      return hash;
    }, 0);
};
