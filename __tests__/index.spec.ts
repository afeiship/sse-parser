import fs from 'node:fs';
import SseParser from '../src';

// standard event stream
const msg1 = fs.readFileSync('__tests__/data/msg1.txt', 'utf8');
// apply7 style stream
const msg2 = fs.readFileSync('__tests__/data/msg2.txt', 'utf8');
// json style stream
const msg3 = fs.readFileSync('__tests__/data/msg3.txt', 'utf8');

describe('api.basic', () => {
  test('Type: standard event stream', () => {
    const res1 = SseParser.parse(msg1);
    expect(Array.isArray(res1)).toBe(true);
    expect(res1[0]).toEqual({
      id: 'n0sa4ikz_1',
      event: 'start',
      data: '0%',
    });
  });

  test('Type: apply7 style stream', () => {
    const res2 = SseParser.parse(msg2, { type: 'apply7' });
    expect(Array.isArray(res2)).toBe(true);
    expect(res2[0]).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test('Type: Json style stream', () => {
    const res2 = SseParser.parse(msg3, { type: 'json' });
    expect(Array.isArray(res2)).toBe(true);
    expect(res2[0]).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test.only('parse one', () => {
    const msg1 = `data:{"type": "processing", "status": "understanding", "chat_id": null}`;
    const res1 = SseParser.parseOne(msg1, { type: 'apply7' });
    expect(res1).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });

  test('custom parser', () => {
    const msg_custom = `abcx: {"type": "processing", "status": "understanding", "chat_id": null}`;
    const res_custom = SseParser.parseOne(msg_custom, {
      parse: (data) => JSON.parse(data.split(': ')[1]),
    });
    expect(res_custom).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });
});
