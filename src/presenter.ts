import { CodeSnapshots } from "./types/code"

class Presenter {
  private _name: string;
  private _snapshots: CodeSnapshots[] = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get frames(): CodeSnapshots[] {
    return this._snapshots;
  }
}

export { Presenter };
