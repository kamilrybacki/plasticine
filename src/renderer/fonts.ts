export type SatoriFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type SatoriFontStyle = 'normal' | 'italic';
export type FontsCacheMap = Map<string, SatoriFontInfo>;
export interface SatoriFontInfo {
    data: Buffer | ArrayBuffer;
    name: string;
    weight?: SatoriFontWeight;
    style?: SatoriFontStyle;
    lang?: string;
};

class FontsCache {
  private _cache: FontsCacheMap = new Map();

  public get size(): number {
    return this._cache.size;
  }

  public save(key: string, font: SatoriFontInfo): void {
    if (!this._cache.has(key)) {
      this._cache.set(key, font);
    }
  };

  public get(key: string): SatoriFontInfo | undefined {
    return this._cache.get(key);
  };

  public clearAll(): void {
    this._cache.clear();
  }

  public regexClear(pattern: RegExp | string): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    for (const key of this._cache.keys()) {
      if (regex.test(key)) {
        this._cache.delete(key);
      }
    }
  }

  public forEach(callback: (value: SatoriFontInfo, key: string, map: FontsCacheMap) => void): void {
    this._cache.forEach(callback);
  }

  public keys(): IterableIterator<string> {
    return this._cache.keys();
  }
};

export const _cache = new FontsCache();

const asCached = (fetcher: (url: string) => Promise<SatoriFontInfo>) => {
  return async (url: string) => {
    if (_cache.get(url)) {
      return _cache.get(url) as SatoriFontInfo;
    }
    const font = await fetcher(url);
    _cache.save(url, font);
    return font;
  };
}

export namespace GoogleFonts {
  export const API_URL = 'https://fonts.googleapis.com/css?family=';
  export const DEFAULT_FONT = 'Roboto';
  export const DEFAULT_WEIGHT = 400;
  export const DEFAULT_STYLE = 'normal';
  
  export const getDefaultFont = async (): Promise<SatoriFontInfo> => {
    return await fetchFont(DEFAULT_FONT);
  }

  export const fetchFont = async (
    family: string,
    weight: number = DEFAULT_WEIGHT,
    style: string = DEFAULT_STYLE
  ): Promise<SatoriFontInfo> => {
    const italicSuffix = style === 'italic' ? 'i' : '';
    return await asCached(
      async (fontUrl: string) => {
        return await fetch(
          fontUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+",
            }
          }
        )
          .then((response: Response) => response.text())
          .then(async (text: string) => {
            const resource = text.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
            if (!resource) {
              throw new Error(`Font ${family}:${weight}${italicSuffix} resource not found`);
            }
            return await fetch(resource[1] as string)
              .then((response) => response.arrayBuffer())
              .catch((error) => {
                throw Error(`Could not fetch font resource: ${error}`)
              });
          })
          .catch((error) => {
            console.error(error);
            return new ArrayBuffer(0);
          })
          .then((data) => {
            return {
              name: family,
              data,
              weight,
              style,
            } as SatoriFontInfo;
          });
      }
    )(`${API_URL}${family.replace(/ /g, '+')}:${weight}${italicSuffix}`);
  };

  export const clearCache = (): void => {
    _cache.regexClear(`/^https:\/\/fonts\.googleapis\.com/`);
  };
};
