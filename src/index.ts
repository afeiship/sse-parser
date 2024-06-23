import Parser from './parser';

export interface SseParserOptions {
  type?: 'standard' | 'json' | 'prefixedJson';
  parse?: (line: string) => any;
}

const defaults: SseParserOptions = {
  type: 'standard',
};

class SseParser {
  private readonly options: SseParserOptions;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  // static methods --- public api ---
  static parse(inMessage: string, inOptions?: SseParserOptions) {
    const parser = new SseParser(inOptions);
    return parser.parse(inMessage);
  }

  static parseOne(inMessage: string, inOptions?: SseParserOptions) {
    const parser = new SseParser(inOptions);
    return parser.parseOne(inMessage);
  }

  get parser() {
    const { type, parse } = this.options;
    if (parse) return parse;
    return Parser[type!];
  }

  parse(inMessage: string) {
    const message = inMessage.trim() || '';
    const messages = message.split('\n\n');
    return messages.map((message) => {
      return this.parser(message);
    });
  }

  parseOne(inMessage: string) {
    return this.parser(inMessage);
  }
}

export default SseParser;
