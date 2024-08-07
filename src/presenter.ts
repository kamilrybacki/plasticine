import { EJS } from "@markup/ejs";
import { CodeSnippet } from "@main/markup/snippet";
import Transistor from "@renderer/transistor";

const DEFAULT_CODE_SNIPPET_LAYOUT = 'templates/code.ejs';

export default class Presenter {
  name: string;
  snapshots: string[] = [];
  readonly layout: string;
  readonly language: string;

  constructor(
    name: string,
    layout: string = DEFAULT_CODE_SNIPPET_LAYOUT,
    language: string = 'plaintext'
  ) {
    this.name = name;
    this.layout = layout;
    this.language = language;
  };

  async addSnapshot(source: string): Promise<void> {
    if (this.snapshots.length === 0) {
      this.snapshots.push(
        await this.renderFrame(source)
      );
      return;
    };
    const previousSource = this.snapshots[this.snapshots.length - 1];
    const currentTransistor = new Transistor(previousSource, source);
    while(currentTransistor.currentSource != source) {
      this.snapshots.push(
        await this.renderFrame(currentTransistor.next(), 'plaintext')
      );
    };
    this.snapshots.push(
      await this.renderFrame(source)
    );
  };

  async renderFrame(
    frameSource: string,
    language: string = this.language
  ): Promise<string> {
    return await EJS
      .render(this.layout, {
        code: new CodeSnippet(frameSource, language).lines,
        name: this.name,
      });
  };
};
