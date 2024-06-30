import fs from 'fs';
import PrefixedJsonParser from '../src/parsers/prefixed-json';
import SseParser from '../src';

const parser = PrefixedJsonParser.parse;

const options = {
  prefix: 'data:',
};

// bun test __tests__/prefixed-json-full.spec.ts

describe('PrefixedJsonParser', () => {
  let s1: string, s2: string, s3: string;
  let expectResults = [
    { 'type': 'processing', 'status': 'understanding', 'chat_id': null },
    { 'type': 'processing', 'status': 'processing', 'chat_id': '6676c0d27b009f1007f1040c' },
    { 'type': 'ssd', 'status': null, 'chat_id': '6676c0d27b009f1007f1040c' },
    { 'type': 'processing', 'status': 'done11' },
    { 'type': 'processing', 'status': 'done' },
  ];

  beforeEach(() => {
    s1 = fs.readFileSync('__tests__/fixtures/prefixed-json/02-breaked/s1.txt', 'utf8');
    s2 = fs.readFileSync('__tests__/fixtures/prefixed-json/02-breaked/s2.txt', 'utf8');
    s3 = fs.readFileSync('__tests__/fixtures/prefixed-json/02-breaked/s3.txt', 'utf8');
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
    //
    parser(s3, {
      ...options, onMessage: ({ item }) => {
        result.push(item);
      },
    });

    // console.log('result: ', result);

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
