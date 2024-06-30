import type { ParserOptions } from '..';

export default class PrefixedJson {
  private static buffer = '';

  static parse(inStreamChunk: string, inOptions: ParserOptions) {
    const { prefix, onMessage } = inOptions;
    const streamedChunk = PrefixedJson.buffer ? (PrefixedJson.buffer + inStreamChunk) : inStreamChunk;
    const messages = streamedChunk.split('\n\n').filter(item => item.trim());
    const prefixLength = prefix!.length;

    messages.forEach((message, index) => {
      if (message.startsWith(prefix!)) {
        const validMsg = message.slice(prefixLength).trim();
        try {
          const data = JSON.parse(validMsg);
          onMessage?.({ item: data, index });
          PrefixedJson.buffer = '';
        } catch (e) {
          /**
           * Chinese:
           * 这里存在的情况是： data:{"type": "ssd", "sta 但有可能后面会有一个换行，所以下次拼接的时候，注意要把换行去掉
           * 否则会出现这种情况： data:{"type": "ssd", "sta\ntus": "ok"} 最终导致 JSON.parse 报错解析失败
           *
           * English:
           * The situation here is: data:{"type": "ssd", "sta but there may be a newline at the end, so when splicing next time, be sure to remove the newline
           * Otherwise, it will lead to such a situation: data:{"type": "ssd", "sta\ntus": "ok"} and cause JSON.parse to fail to parse
           */
          PrefixedJson.buffer = message.trim();
        }
      } else {
        PrefixedJson.buffer += message.trim();
      }
    });
  }
}
