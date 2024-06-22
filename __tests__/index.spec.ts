import fs from 'node:fs';
import SseParser from '../src';

const msg1 = fs.readFileSync('__tests__/data/msg1.txt', 'utf8');
const msg2 = fs.readFileSync('__tests__/data/msg2.txt', 'utf8');

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


  test.only('Type: Json style stream', () => {
    const res2 = SseParser.parse(msg2, { type: 'json' });
    expect(Array.isArray(res2)).toBe(true);
    expect(res2[0]).toEqual({ type: 'processing', status: 'understanding', chat_id: null });
  });
});
