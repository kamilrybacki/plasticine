import { EJS } from "@markup/ejs";
import { CodeSnippet } from "@main/markup/snippet";
import Transistor from "@renderer/transistor";
import { fileURLToPath } from 'url';
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_CODE_SNIPPET_LAYOUT = `${__dirname}/templates/code.ejs`;
export const DEFAULT_CODE_SNIPPET_LANGUAGE = 'plaintext';

export default class Presenter {
  name: string;
  title: string;
  snapshots: string[] = [];
  readonly layout: string;
  readonly language: string;

  constructor(
    name: string,
    title: string = '',
    layout: string = DEFAULT_CODE_SNIPPET_LAYOUT,
    language: string = DEFAULT_CODE_SNIPPET_LANGUAGE
  ) {
    this.name = name;
    this.title = title;
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
        titleStyle: 'font-bold text-lg',
        title: this.title,
      });
  };
};
