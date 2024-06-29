import type { ParserOptions } from '../index';

export default class PrefixedJsonParser {
  private static buffer = '';

  static parse(inStreamChunk: string, inOptions: ParserOptions) {
    const { prefix, onMessage } = inOptions;
    const streamedChunk = PrefixedJsonParser.buffer ? (PrefixedJsonParser.buffer + inStreamChunk) : inStreamChunk;
    const messages = streamedChunk.split('\n\n');
    const prefixLength = prefix!.length;
    messages.forEach((message, index) => {
      if (message.startsWith(prefix!)) {
        const validMsg = message.slice(prefixLength).trim();
        try {
          const data = JSON.parse(validMsg);
          onMessage?.({ item: data, index });
          PrefixedJsonParser.buffer = '';
        } catch (e) {
          PrefixedJsonParser.buffer = message;
        }
      } else {
        PrefixedJsonParser.buffer += message;
      }
    });
  }
}
