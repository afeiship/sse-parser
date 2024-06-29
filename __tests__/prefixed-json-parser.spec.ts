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
    const streamChunks1 = [
      'data:{"type": "processing", "status": "understanding", "chat_id": null}',
      'data:{"type": "processing", "status": "processing", "chat_id": "6676c0d27b009f1007f1040c"}',
      'data:{"type": "ssd", "sta',
    ].join('\n\n');

    const streamChunks2 = [
      'tus": null, "chat_id": "6676c0d27b009f1007f1040c"}',
      'data: {"type": "processing", "status": "done"}',
      '{"type": "processing", "status": "done"}',
    ].join('\n\n');

    const streamChunks = [streamChunks1, streamChunks2];

    streamChunks.forEach((chunk) => {
      parser(chunk, {
        ...options,
        onMessage: ({ item }) => {
          console.log('item: ', item);
        },
      })
    });
  });
});
