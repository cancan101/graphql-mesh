import { graphql } from 'graphql';

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

  it('Querying by organization', async () => {
    const query = /* GraphQL */ `
      query {
        getScheduledEvents(organization: "http://a") {
          __typename
        }
      }
    `;
    const fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),

        ok: true,
      } as Response)
    );
    const createdSchema = await loadGraphQLSchemaFromOpenAPI('calendly', {
      source: './fixtures/calendly.yml',
      cwd: __dirname,
      fetch,
    });
    return graphql({ schema: createdSchema, source: query }).then((result: any) => {
      expect(fetch.mock.calls[0][0]).toEqual(
        'https://api.calendly.com/scheduled_events?organiztion=http://a&count=20&'
      );
    });
  });

  it('Querying by invitee_email', async () => {
    const query = /* GraphQL */ `
      query {
        getScheduledEvents(invitee_email: "a@b.com") {
          __typename
        }
      }
    `;
    const fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),

        ok: true,
      } as Response)
    );
    const createdSchema = await loadGraphQLSchemaFromOpenAPI('calendly', {
      source: './fixtures/calendly.yml',
      cwd: __dirname,
      fetch,
    });

    return graphql({ schema: createdSchema, source: query }).then((result: any) => {
      expect(fetch.mock.calls[0][0]).toEqual(
        'https://api.calendly.com/scheduled_events?invitee_email=a%40b.com&count=20'
      );
    });
  });
});