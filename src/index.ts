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

    switch (type) {
      case'standard':
        return this.parseStandard;
      case 'json':
        return this.parseJson;
      case 'prefixedJson':
        return this.parsePrefixedJson;
      default:
        return this.parseStandard;
    }
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

  // private methods --- parser functions ---
  private parseStandard(inMessage: string) {
    const message = inMessage.trim() || '';
    const lines = message.split('\n');
    return lines.reduce((acc, line) => {
      const [key, value] = line.split(':');
      acc[key] = value;
      return acc;
    }, {} as any);
  }

  private parseJson(inMessage: string) {
    const message = inMessage.trim() || '';
    return JSON.parse(message);
  }

  private parsePrefixedJson(inMessage: string) {
    const message = inMessage.trim() || '';
    const dataValue = message.split(':').slice(1).join(':');
    return JSON.parse(dataValue);
  }
}

export default SseParser;
