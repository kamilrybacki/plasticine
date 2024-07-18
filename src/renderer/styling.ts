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

  public asCached(
    fetcher: (url: string) => Promise<SatoriFontInfo>
  ): (url: string) => Promise<SatoriFontInfo> {
    return async (url: string) => {
      if (this._cache.has(url)) {
        return this.get(url) as SatoriFontInfo;
      }
      const font = await fetcher(url);
      this.save(url, font);
      return font;
    };
  }
};

export const _cache = new FontsCache();

export namespace GoogleFonts {
  const API_URL = 'https://fonts.googleapis.com/css?family=';
  const FALLBACK_FONT = 'Roboto';
  
  export const fetchFont = async (
    family: string,
    weight: number = 400,
    style: string = 'normal'
  ): Promise<SatoriFontInfo> => {
    return await _cache.asCached(
      async (fontUrl: string) => {
        return fetch(fontUrl)
          .then((res) => res.arrayBuffer())
          .then((data) => {
            return {
              name: family,
              data,
              weight,
              style,
            };
          })
          .catch(() => fetchFont(FALLBACK_FONT));
      }
    )(`${API_URL}${family}`);
  };

  export const clearCache = (): void => {
    _cache.regexClear(`/^https:\/\/fonts\.googleapis\.com/`);
  };
};
