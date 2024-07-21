export type CodeSnippetMetadata = {
  language: string;
  code: string;
}

export type CodeSnippetNote = {
  content: string;
  line: number;
  style?: string;
};

export type CodeSnapshotDecoration = {
  position: [number, number];
  content: string;
  style: string;
};
