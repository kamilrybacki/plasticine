import { Diffs } from "@main/utils";

export default class Transistor {
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
    if (this.currentSource != this.sourceAfter) {
      this.currentSource = this.advanceToNextSourceVersion();
    };
    return this.currentSource;
  };

  private advanceToNextSourceVersion(): string {
    const foundTransition = this._findNextTransition();
    return foundTransition ? this._transitions
      .reduce((next: string, difference: Diffs.Difference) => {
        if (difference == foundTransition) {
          next = this._applyTransition(next, difference);
          difference.nullify();
        } else {
          next = next.concat(
            difference.text.repeat(+!difference.changed)
          );
        };
        return next;
      }, '') : this.currentSource;
  };

  private _findNextTransition(): Diffs.Difference | null {
    let foundTransition: Diffs.Difference | null = null;
    let transitionIndex = 0;
    while (!foundTransition) {
      foundTransition = this._transitions[transitionIndex].changed
        ? this._transitions[transitionIndex]
        : null;
      if (!foundTransition) { transitionIndex++ };
      if (transitionIndex >= this._transitions.length) { break; }
    };
    return foundTransition;
  };

  private _applyTransition(
    source: string,
    difference: Diffs.Difference,
  ): string {
    switch (difference.operation) {
      case 'add': {
        source = source.concat(difference.text);
        break;
      }
      case 'remove': {
          source = source.substring(
          0, source.length - difference.text.length
        );
        break;
      };
    };
    return source;
  };
};
