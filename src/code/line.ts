import { 
  hashFromString 
} from "@main/utils";

export type CodeLineHash = number;
export const isLineHash = (hash: any): hash is CodeLineHash => typeof hash === 'number';
export const DEFAULT_SPACES_PER_INDENT = 2;

export class CodeLine {
  id: CodeLineHash;
  lineNumber: number;
  content: string;

  private _indent: number;
  private spacesPerIndent = DEFAULT_SPACES_PER_INDENT;

  private applyNewIndent() {
    this.content = ' '.repeat(this.spacesPerIndent * this._indent) + this.content.trimStart()
  }

  private calculateIndent(): number {
    return CodeLine.calculateIndents(
      this.content,
      this.spacesPerIndent
    )
  }

  static calculateIndents(content: string, perIndent: number): number {
    const calculatedIndent = (content.length - content.trimStart().length) / perIndent;
    return Math.floor(calculatedIndent);
  }

  public setIndentSize(spaces: number) {
    this.spacesPerIndent = spaces;
    this.applyNewIndent();
  }

  constructor(number: number, content: string) {
    this.lineNumber = number;
    this.content = content;
    this._indent = this.calculateIndent();
    this.applyNewIndent();

    this.id = hashFromString(`${number}${content}`);
  };
};
