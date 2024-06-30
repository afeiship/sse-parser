import PrefixedJson from './parsers/prefixed-json';

export type ParserType = 'standard' | 'json' | 'prefixedJson';

export interface ParserOptions {
  prefix?: string;
  debug?: boolean;
  onMessage?: (data: any) => void;
}

export interface SseParserOptions extends ParserOptions {
  type?: 'standard' | 'json' | 'prefixedJson';
}

const defaults: SseParserOptions = {
  type: 'standard',
  prefix: 'data:',
  debug: false,
  onMessage: (data: any) => {
  },
};

class SseParser {
  private options: SseParserOptions;
  private static instance: any;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  setOptions(inOptions: SseParserOptions) {
    this.options = { ...this.options, ...inOptions };
  }

  static parse(inMessage: string, inOptions?: SseParserOptions) {
    SseParser.instance ||= new SseParser(inOptions);
    SseParser.instance.setOptions(inOptions);
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
