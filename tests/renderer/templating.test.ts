import {
    describe,
    it,
    expect,
} from '@jest/globals';
import { EJS } from '@renderer/templating';

const TEST_TEMPLATE_FILE = './tests/assets/test.ejs';
const TEST_TEMPLATING_DATA = { name: 'Satori' };

describe('Templating module', () => {
  const templateTestCase = async (template: string): Promise<string> => {
    return await EJS.render(template, TEST_TEMPLATING_DATA);
  };
  
  it('should be able to load an EJS template from a file', async () => {
        const template = await templateTestCase(TEST_TEMPLATE_FILE);
        expect(template).toContain('Hello, Satori!');
    });

    it('should be able to load an EJS template from a string', async () => {
        const template = await templateTestCase('<h1>Hello, <%= name %>!</h1>');
        expect(template).toContain('Hello, Satori!');
    });
});
