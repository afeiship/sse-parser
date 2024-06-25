import Parser from './parser';

export type SseItem = { item: any; index: number };
export type SseCallback = (item: SseItem) => void;

export interface SseParserOptions {
  type?: 'standard' | 'json' | 'prefixedJson';
  parse?: (line: string) => any;
  callback?: SseCallback;
}

const defaults: SseParserOptions = {
  type: 'standard',
  callback: (item: SseItem) => {
  },
};

class SseParser {
  private readonly options: SseParserOptions;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  // static methods --- public api ---
  static parse(inMessage: string, inOptions?: SseParserOptions) {
    const { callback, ...options } = inOptions || {};
    const parser = new SseParser(options);
    return parser.parse(inMessage, callback);
  }

  static parseOne(inMessage: string, inOptions?: SseParserOptions) {
    const { callback, ...options } = inOptions || {};
    const parser = new SseParser(options);
    return parser.parseOne(inMessage, callback);
  }

  get parser() {
    const { type, parse } = this.options;
    if (parse) return parse;
    return Parser[type!];
  }

  parse(inMessage: string, inCallback?: SseCallback) {
    const message = inMessage.trim() || '';
    const messages = message.split('\n\n');
    return messages.map((message, index) => {
      const item = this.parser(message);
      inCallback?.({ item, index });
      return item;
    });
  }

  parseOne(inMessage: string, inCallback?: SseCallback) {
    const item = this.parser(inMessage);
    inCallback?.({ item, index: 0 });
    return item;
  }
}

export default SseParser;
