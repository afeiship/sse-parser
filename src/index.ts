import PrefixedJson from './prefixed-json';

export interface ParserOptions {
  prefix?: string;
  onMessage?: (data: any) => void;
  skipNil?: boolean;
}

export interface SseParserOptions extends ParserOptions {
  type?: 'standard' | 'json' | 'prefixedJson';
}

const defaults: SseParserOptions = {
  type: 'standard',
  prefix: 'data:',
  skipNil: false,
  onMessage: (data: any) => {}
};


class SseParser {
  private readonly options: SseParserOptions;

  constructor(inOptions?: SseParserOptions) {
    this.options = { ...defaults, ...inOptions };
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
