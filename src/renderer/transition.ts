import { Difference, getDifferenceBetweenSources } from "@main/utils";

export class Transition {
  public readonly before: string;
  public readonly after: string;
  public readonly diff: Difference[];
  public readonly frames: number;

  constructor(before: string, after: string) {
    this.before = before;
    this.after = after;
    this.diff = getDifferenceBetweenSources(before, after);
    this.frames = this.calculateTransitionFrames();
  };

  calculateTransitionFrames(): number {
    return this.diff
      .reduce((frames: number, difference: Difference) => {
        const didTheTextChange = difference.operation === 'add' || difference.operation === 'remove';
        return didTheTextChange ? frames + difference.text.length : frames;
      }, 0);
  };
};
