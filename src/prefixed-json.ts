import type { ParserOptions } from '.';

// data:{"type": "processing", "status": "understanding", "chat_id": null}

// data:{"type": "processing", "status": "processing", "chat_id": "6676c0d27b009f1007f1040c"}

// data:{"type": "chat_id", "re

// fs": null, "chat_id": "6676c0d27b009f1007f1040c"}

// data: {"type": "processing", "status": "done"}

export default class PrefixedJsonParser {
  private static buffer = '';

  static parse(inStreamChunk: string, inOptions: ParserOptions) {
    const { prefix, skipNil, onMessage } = inOptions;
    const streamedChunk = this.buffer ? this.buffer + inStreamChunk : inStreamChunk;
    const messages = streamedChunk.split('\n\n');
    const prefixLength = prefix!.length;
    messages.forEach((message, index) => {
      if (message.startsWith(prefix!)) {
        const validMsg = message.slice(prefixLength).trim();
        try {
          const data = JSON.parse(validMsg);
          onMessage?.({ item: data, index });
        } catch (e) {
          if (!skipNil) onMessage?.({ item: null, index });
          console.warn('⛔️ Invalid JSON:', validMsg);
        }
        this.buffer = '';
      } else {
        this.buffer += message;
      }
    });
  }
}
