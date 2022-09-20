import { printSchemaWithDirectives } from '@graphql-tools/utils';
import loadGraphQLSchemaFromOpenAPI from '../src';

describe('Calendly', () => {
  it('should generate the correct schema', async () => {
    const schema = await loadGraphQLSchemaFromOpenAPI('calendly', {
      source: './fixtures/calendly.yml',
      cwd: __dirname,
    });
    expect(printSchemaWithDirectives(schema)).toMatchSnapshot();
  });
});
