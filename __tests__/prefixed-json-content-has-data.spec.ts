import fs from 'fs';
import PrefixedJsonParser from '../src/parsers/prefixed-json';
import SseParser from '../src';

const parser = PrefixedJsonParser.parse;

const options = {
  prefix: 'data:',
};

// bun test __tests__/prefixed-json-full.spec.ts

describe('PrefixedJsonParser', () => {
  let s1;
  let expectResults = [
      { type: 'processing', status: 'understanding', chat_id: null },
      { type: 'processing', status: 'processing', chat_id: '668004375bbc0ffe2f72e200' },
      { type: 'chat_id', refs: null, chat_id: '668004375bbc0ffe2f72e200' },
      { type: 'chat_id', refs: null, chat_id: '668004375bbc0ffe2f72e200' },
      { answer: 'Process data: 16.88%', chat_id: '668004375bbc0ffe2f72e200' },
    ]
  ;

  beforeEach(() => {
    s1 = fs.readFileSync('__tests__/fixtures/prefixed-json/03-content-has-data/s1.txt', 'utf8');
  });

  test('should parse prefixed json', () => {
    const result: any[] = [];

    parser(s1, {
      ...options, onMessage: ({ item }) => {
        result.push(item);
      },
    });

    expect(result).toEqual(expectResults);
  });

  test('sse parser should work with prefixed json', () => {
    const result: any[] = [];
    SseParser.parse(s1, {
      type: 'prefixedJson',
      ...options,
      onMessage: ({ item }) => {
        result.push(item);
      },
    });

    // console.log(result);
    expect(result).toEqual(expectResults);
  });
});
