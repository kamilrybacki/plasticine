import { Diffs } from "@main/utils";

export class Transistor {
  public readonly sourceBefore: string;
  public readonly sourceAfter: string;
  public readonly totalTransitionsNeeded: number;
  public currentSource: string;
  public currentFrame: number;

  private _transitions: Diffs.Difference[] = [];

  constructor(before: string, after: string) {
    this.sourceBefore = before;
    this.sourceAfter = after;
    this.transitions = Diffs.getDifferences(before, after);
    this.totalTransitionsNeeded = this.calculateTransitionsAmount();
    this.currentFrame = 0;
    this.currentSource = before;
  };

  set transitions(
    initialDifferences: Diffs.Difference[]
  ) {
    this._transitions = initialDifferences
      .reduce((adjustedDifferences: Diffs.Difference[], difference: Diffs.Difference, index: number) => {
        if (difference.operation == 'remove') {
          index > 0
            ? adjustedDifferences[index - 1].text += difference.text
            : adjustedDifferences.push(
              Diffs.fromDict(difference.text, 'leave')
            );
        };
        adjustedDifferences.push(difference);
        return adjustedDifferences;
      }, [] as Diffs.Difference[])
      .reduce((expandedDifferences: Diffs.Difference[], difference: Diffs.Difference) => {
        if (difference.text.length) {
          if (difference.changed) {
            const characters = difference.text.split('');
            characters.forEach((character: string) => {
              expandedDifferences.push(
                Diffs.fromDict(character, difference.operation)
              );
            });
          } else { expandedDifferences.push(difference); }
        };
        return expandedDifferences;
      }, [] as Diffs.Difference[]);
  };

  get transitions(): Diffs.Difference[] {
    return this._transitions;
  };

  calculateTransitionsAmount(): number {
    return this.transitions
      .reduce((frames: number, difference: Diffs.Difference) => {
        return frames + +difference.changed;
      }, 0);
  };

  next(): string {
    if (this.currentFrame < this.totalTransitionsNeeded) {
      this.advanceToNextSourceVersion();
    }
    return this.currentSource;
  };

  private advanceToNextSourceVersion(): void {
    let changeApplied: boolean = false;
    this.currentSource = this.transitions
      .reduce((
        newSource: string,
        difference: Diffs.Difference
      ) => {
        changeApplied = changeApplied || difference.changed;
        switch (difference.operation) {
          case 'add': newSource += difference.text.substring(
            0, difference.text.length * +changeApplied
          )
          case 'remove': newSource = newSource.substring(
            0, newSource.length - difference.text.length * +changeApplied
          )
          case 'leave': newSource += difference.text
        };
        return newSource;
      }, '');
  };
};
