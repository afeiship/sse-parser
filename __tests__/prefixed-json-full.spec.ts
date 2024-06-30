import fs from 'fs';
import PrefixedJsonParser from '../src/parsers/prefixed-json';
import SseParser, { ParserType } from '../src';

const parser = PrefixedJsonParser.parse;

const options = {
  prefix: 'data:',
};

// bun test __tests__/prefixed-json-full.spec.ts

describe('PrefixedJsonParser', () => {
  let s1: string, s2: string, s3: string;
  let expectResults = [
    { type: 'processing', status: 'understanding', chat_id: null },
    { type: 'processing', status: 'processing', chat_id: '667ffc5a5bbc0ffe2f72e1cb' },
    { type: 'chat_id', refs: null, chat_id: '667ffc5a5bbc0ffe2f72e1cb' },
    { type: 'processing', status: 'done' },
    { answer: '要', chat_id: '667ffc5a5bbc0ffe2f72e1cb' },
    { answer: '改善', chat_id: '667ffc5a5bbc0ffe2f72e1cb' },
    {
      type: 'suggested_responses',
      suggested_responses: ['你能给我一些具体的写作例子吗？', '我应该避免什么话题？'],
      chat_id: '667ffc5a5bbc0ffe2f72e1cb',
    },
    { type: 'end', chat_id: '667ffc5a5bbc0ffe2f72e1cb' },
  ];

  beforeEach(() => {
    s1 = fs.readFileSync('__tests__/fixtures/prefixed-json/01-full/s1.txt', 'utf8');
    s2 = fs.readFileSync('__tests__/fixtures/prefixed-json/01-full/s2.txt', 'utf8');
    s3 = fs.readFileSync('__tests__/fixtures/prefixed-json/01-full/s3.txt', 'utf8');
  });

  test('should parse prefixed json', () => {
    const result: any[] = [];

    parser(s1, {
      ...options, onMessage: ({ item }) => {
        result.push(item);
      },
    });

    parser(s2, {
      ...options, onMessage: ({ item }) => {
        result.push(item);
      },
    });

    parser(s3, {
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

    SseParser.parse(s2, {
      type: 'prefixedJson',
      ...options,
      onMessage: ({ item }) => {
        result.push(item);
      },
    });

    SseParser.parse(s3, {
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
