import PrefixedJson from './parsers/prefixed-json';

export interface ParserOptions {
  prefix?: string;
  onMessage?: (data: any) => void;
}

export interface SseParserOptions extends ParserOptions {
  type?: 'standard' | 'json' | 'prefixedJson';
}

const defaults: SseParserOptions = {
  type: 'standard',
  prefix: 'data:',
  onMessage: (data: any) => {
  },
};


class SseParser {
  private readonly options: SseParserOptions;
  private static instance: any;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  static parse(inMessage: string, inOptions?: SseParserOptions) {
    SseParser.instance ||= new SseParser(inOptions);
    return SseParser.instance.parse(inMessage);
  }

  parse(inMessage: string) {
    const { type, ...options } = this.options;
    const message = inMessage.trim() || '';
    switch (type) {
      case 'json':
        // Parser.parse(message, options);
        break;
      case 'prefixedJson':
        PrefixedJson.parse(message, options);
        break;
      default:
      // this.parseStandard(message);
    }
  }
}

export default SseParser;
