export type SatoriFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type SatoriFontStyle = 'normal' | 'italic';
export interface SatoriFontInfo {
    data: Buffer | ArrayBuffer;
    name: string;
    weight?: SatoriFontWeight;
    style?: SatoriFontStyle;
    lang?: string;
}

export type FontsCacheMap = Map<string, SatoriFontInfo>;
