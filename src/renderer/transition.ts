import { Difference, getDifferenceBetweenSources } from "@main/utils";

export class Transition {
  public readonly before: string;
  public readonly after: string;
  public readonly diff: Difference[];

  constructor(before: string, after: string) {
    this.before = before;
    this.after = after;
    this.diff = getDifferenceBetweenSources(before, after);
  };
};
