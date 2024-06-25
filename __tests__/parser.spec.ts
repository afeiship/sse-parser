import parser from '../src/parser';

describe('SseParser parser tests', () => {
  test('Type: standard parser', () => {
    const txt = `id:n0sa4ikz_1\nevent:start\ndata:0%`;
    const res = parser.standard(txt);
    expect(res).toEqual({ id: 'n0sa4ikz_1', event: 'start', data: '0%' });
  });

  test('Type: json parser', () => {
    const data1 = ` {"type": "end", "chat_id": "6676c0d27b009f1007f1040c"}`;
    const data2 = `{"type": "message", "chat_id": "6676c0d27b009f1007f1040c", "message": "Hello, world!"}`;
    const res1 = parser.json(data1);
    const res2 = parser.json(data2);
    expect(res1).toEqual({ type: 'end', chat_id: '6676c0d27b009f1007f1040c' });
    expect(res2).toEqual({ type: 'message', chat_id: '6676c0d27b009f1007f1040c', message: 'Hello, world!' });
  });

  test('Type: prefixedJson parser', () => {
    const data1 = `data:{"answer": "\u63d0\u5347", "chat_id": "6676c0d27b009f1007f1040c"}`;
    const data2 = `data:{"type": "message", "answer": "Processed metadata: 1234567890"}`;
    const data3_err = `data:{"type":`;
    const res1 = parser.prefixedJson(data1);
    const res2 = parser.prefixedJson(data2);
    const res3_err = parser.prefixedJson(data3_err);
    expect(res1).toEqual({ answer: '提升', chat_id: '6676c0d27b009f1007f1040c' });
    expect(res2).toEqual({ type: 'message', answer: 'Processed metadata: 1234567890' });
    expect(res3_err).toBe(null);
  });
});
