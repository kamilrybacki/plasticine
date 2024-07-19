import { SatoriFontInfo, FontsCacheMap } from "@typings/style";

class FontsCache {
  private _cache: FontsCacheMap = new Map();

  public get size(): number {
    return this._cache.size;
  }

  public save(key: string, font: SatoriFontInfo): void {
    if (!this._cache.has(key)) {
      this._cache.set(font.name, font);
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
  const API_URL = 'https://fonts.googleapis.com/css?family=';
  const FALLBACK_FONT = 'Roboto';
  
  export const getDefaultFont = async (): Promise<SatoriFontInfo> => {
    return await fetchFont(FALLBACK_FONT);
  }

  export const fetchFont = async (
    family: string,
    weight: number = 400,
    style: string = 'normal'
  ): Promise<SatoriFontInfo> => {
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
              throw new Error('Font resource not found');
            }
            return await fetch(resource[1] as string)
              .then((response) => response.arrayBuffer());
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
    )(`${API_URL}${family}`);
  };

  export const clearCache = (): void => {
    _cache.regexClear(`/^https:\/\/fonts\.googleapis\.com/`);
  };
};
