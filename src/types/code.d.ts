
export type CodeSnapshot = {
  title: string;
  snippet: CodeSnippet
  language: string;
  backgroundStyle: string;
  decorations: Decoration[];
};

export type CodeSnippet = {
  code: string;
  notes: string;
};

export type Decoration = {
  position: [number, number];
  content: string;
  style: string;
};
