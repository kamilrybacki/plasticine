
export type SatoriFontInfo = {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: string;
};

export type FontsCacheMap = Map<string, SatoriFontInfo>;
