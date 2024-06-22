export interface SseParserOptions {
  type: 'standard' | 'json';
  parse?: (data: string) => any;
}

const defaults: SseParserOptions = {
  type: 'standard',
};

class SseParser {
  private readonly options: SseParserOptions;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  static parse(inMessage: string, inOptions?: SseParserOptions) {
    const parser = new SseParser(inOptions);
    return parser.parse(inMessage);
  }

  get parser() {
    const { type, parse } = this.options;
    if (parse) return parse;

    switch (type) {
      case'standard':
        return this.parseStandard;
      case 'json':
        return this.parseJson;
    }
  }

  parse(inMessage: string) {
    const message = inMessage.trim() || '';
    const messages = message.split('\n\n');
    return messages.map((message) => {
      return this.parser(message);
    });
  }

  parseStandard(inMessage: string) {
    const message = inMessage.trim() || '';
    const lines = message.split('\n');
    return lines.reduce((acc, line) => {
      const [key, value] = line.split(':');
      acc[key] = value;
      return acc;
    }, {} as any);
  }

  parseJson(inMessage: string) {
    const message = inMessage.trim() || '';
    const dataValue = message.split(':').slice(1).join(':');
    return JSON.parse(dataValue);
  }
}

export default SseParser;
