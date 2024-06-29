import type { ParserOptions } from '..';

export default class PrefixedJson {
  private static buffer = '';

  static parse(inStreamChunk: string, inOptions: ParserOptions) {
    const { prefix, onMessage } = inOptions;
    const streamedChunk = PrefixedJson.buffer ? (PrefixedJson.buffer + inStreamChunk) : inStreamChunk;
    const messages = streamedChunk.split('\n\n');
    const prefixLength = prefix!.length;
    messages.forEach((message, index) => {
      if (message.startsWith(prefix!)) {
        const validMsg = message.slice(prefixLength).trim();
        try {
          const data = JSON.parse(validMsg);
          onMessage?.({ item: data, index });
          PrefixedJson.buffer = '';
        } catch (e) {
          PrefixedJson.buffer = message;
        }
      } else {
        PrefixedJson.buffer += message;
      }
    });
  }
}
