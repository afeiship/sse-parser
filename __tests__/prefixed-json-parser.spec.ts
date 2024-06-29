import fs from 'fs';
import PrefixedJsonParser from '../src/parsers/prefixed-json';

const parser = PrefixedJsonParser.parse;

const options = {
  prefix: 'data:',
};

// spy on console.warn
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {
  });
});

describe('PrefixedJsonParser parse', () => {
  // data:{"type": "processing", "status": "understanding", "chat_id": null}
  // data:{"type": "processing", "status": "processing", "chat_id": "6676c0d27b009f1007f1040c"}
  // data:{"type": "chat_id", "re
  // fs": null, "chat_id": "6676c0d27b009f1007f1040c"}
  // data: {"type": "processing", "status": "done"}

  test('should parse prefixed json', () => {
    let msgCount = 0;
    const streamChunks1 = [
      'data:{"type": "processing", "status": "understanding", "chat_id": null}',
      'data:{"type": "processing", "status": "processing", "chat_id": "6676c0d27b009f1007f1040c"}',
      'data:{"type": "ssd", "sta',
    ].join('\n\n');

    const streamChunks2 = [
      'tus": null, "chat_id": "6676c0d27b009f1007f1040c"}',
      'data: {"type": "processing"',
    ].join('\n\n');

    const streamChunks3 = [
      ',"status": "done11"}',
      'data: {"type": "processing", "status": "done"}',
    ].join('\n\n');

    const streamChunks = [streamChunks1, streamChunks2, streamChunks3];

    streamChunks.forEach((chunk) => {
      parser(chunk, {
        ...options,
        onMessage: ({ item }) => {
          msgCount++;
        },
      });
    });

    expect(msgCount).toBe(5);
  });

  test('file msg', () => {
    const msg1 = fs.readFileSync('__tests__/data/msg2.txt');
    let md = '';
    parser(msg1.toString(), {
      ...options,
      onMessage: ({ item }) => {
        // console.log(item);
        if (item.answer) {
          md += item.answer;
        }
      },
    });
  });

  test('apply7 msgs example', () => {
    const streamChunks = fs.readFileSync('__tests__/data/prefixed-json.txt').toString();
    let msgCount = 0;
    parser(streamChunks, {
      ...options,
      onMessage: ({ item }) => {
        // console.log('item: ', item);
        msgCount++;
      },
    });

    expect(msgCount).toBe(7);
  });
});
