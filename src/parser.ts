export default class Parser {
  static standard(inMessage: string) {
    const message = inMessage.trim() || '';
    const lines = message.split('\n');
    return lines.reduce((acc, line) => {
      const [key, value] = line.split(':');
      acc[key] = value;
      return acc;
    }, {} as any);
  }

  static json(inMessage: string) {
    const message = inMessage.trim() || '';
    return JSON.parse(message);
  }

  static prefixedJson(inMessage: string) {
    const message = inMessage.trim() || '';
    const dataValue = message.split(':').slice(1).join(':');
    return JSON.parse(dataValue);
  }
}
