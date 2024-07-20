import { CodeSnapshot } from "./types/code"

class Presenter {
  private _name: string;
  private _snapshots: CodeSnapshot[] = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get frames(): CodeSnapshot[] {
    return this._snapshots;
  }

  addFrame(frame: CodeSnapshot): void {
    this._snapshots.push(frame);
  }
}

export { Presenter };
