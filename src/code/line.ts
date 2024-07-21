import { hashFromString } from "@main/utils";

export type CodeLineHash = number;
export const isLineHash = (hash: any): hash is CodeLineHash => typeof hash === 'number';

export class CodeLine {
  id: CodeLineHash;
  lineNumber: number;
  content: string;

  constructor(number: number, content: string) {
    this.lineNumber = number;
    this.content = content;
    this.id = hashFromString(`${number}${content}`);
  }
};
