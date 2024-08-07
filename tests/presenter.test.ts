import { describe, it, expect } from '@jest/globals';
import Presenter, { DEFAULT_CODE_SNIPPET_LAYOUT, DEFAULT_CODE_SNIPPET_LANGUAGE } from '@main/presenter';

describe('Presenter structure', () => {
    const presenter = new Presenter('John Doe');
    const HELLO_WORLD_RENDERED = `
    <main>
        <pre>
        <code>
          Hello, world!
        </code>
      </pre>
    </main>
    `;

    it('should have a name', () => expect(presenter.name).toBe('John Doe'));

    it('should start with empty snapshot frames collection', () => expect(presenter.snapshots).toEqual([]));

    it('should have a default layout', () => expect(presenter.layout).toBe(DEFAULT_CODE_SNIPPET_LAYOUT));

    it('should have a default language', () => expect(presenter.language).toBe(DEFAULT_CODE_SNIPPET_LANGUAGE));

    it('should add a snapshot frame', async () => {
      await presenter.addSnapshot('Hello, world!')
        .then(() => {
          expect(
            presenter.snapshots.pop()?.replace(/\s/g, '')
          ).toEqual(
            HELLO_WORLD_RENDERED.replace(/\s/g, '')
          );
        });
    });
});
