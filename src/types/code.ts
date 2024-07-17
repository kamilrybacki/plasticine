
export type CodeSnapshots = {
  title: string;
  snippets: CodeSnippet[]
  language: string;
};

export type CodeSnippet = {
  code: string;
  notes: string;
  backgroundStyle: string;
  decorations: Decoration[];
};

export type Decoration = {
  position: [number, number];
  style: string;
};
