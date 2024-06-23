import fs from 'node:fs';
import SseParser from '../src';

// standard event stream
const msg1 = fs.readFileSync('__tests__/data/msg1.txt', 'utf8');
// apply7 style stream
const msg2 = fs.readFileSync('__tests__/data/msg2.txt', 'utf8');
// json style stream
const msg3 = fs.readFileSync('__tests__/data/msg3.txt', 'utf8');

// msg special characters
const msg4 = fs.readFileSync('__tests__/data/msg-special.txt', 'utf8');

describe('SseParser unit tests', () => {
  test('Type: standard event stream', () => {
    const res1 = SseParser.parse(msg1);
    expect(Array.isArray(res1)).toBe(true);
    expect(res1[0]).toEqual({
      id: 'n0sa4ikz_1',
      event: 'start',
      data: '0%',
    });
  });

  test('Type: prefixedJson style stream', () => {
    const res2 = SseParser.parse(msg2, { type: 'prefixedJson' });
    expect(Array.isArray(res2)).toBe(true);
    expect(res2[0]).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test('Type: Json style stream', () => {
    const res2 = SseParser.parse(msg3, { type: 'json' });
    expect(Array.isArray(res2)).toBe(true);
    expect(res2[0]).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test('parse one', () => {
    const msg1 = `data:{"type": "processing", "status": "understanding", "chat_id": null}`;
    const msg2 = `{"type": "processing", "status": "understanding", "chat_id": null}`;
    const msg3 = `id:n0sa4ikz_1\nevent:start\ndata:0%`;
    const res1 = SseParser.parseOne(msg1, { type: 'prefixedJson' });
    const res2 = SseParser.parseOne(msg2, { type: 'json' });
    const res3 = SseParser.parseOne(msg3, { type: 'standard' });
    expect(res1).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
    expect(res2).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
    expect(res3).toEqual({ id: 'n0sa4ikz_1', event: 'start', data: '0%' });
  });

  test('custom parser', () => {
    const msg = `abcx@ {"type": "processing", "status": "understanding", "chat_id": null}`;
    const res = SseParser.parseOne(msg, {
      parse: (line) => {
        return JSON.parse(line.slice('abcx@ '.length));
      },
    });
    expect(res).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test('special characters value has "http://" prefix', () => {
    const res4 = SseParser.parse(msg4);
    const last = res4[res4.length - 1];
    expect(last).toEqual({
      id: 'x8rdlrnd_38',
      event: 'finish',
      data: 'http://localhost:9081/api/static/ppts/zip/phYZ000.pptx',
    });
  });
});
