export default class Parser {
  static standard(inMessage: string) {
    const message = inMessage.trim() || '';
    const lines = message.split('\n');
    return lines.reduce((acc, line) => {
      const parts = line.split(':');
      const key = parts.shift();
      acc[key!] = parts.join(':');
      return acc;
    }, {} as any);
  }

  static json(inMessage: string) {
    const message = inMessage.trim() || '';
    return JSON.parse(message);
  }

  static prefixedJson(inMessage: string) {
    const message = inMessage.trim() || '';
    const idx = message.indexOf(':');
    if (idx === -1) return null;
    const dataValue = message.slice(idx + 1);
    try {
      return JSON.parse(dataValue);
    } catch (e) {
      console.warn('⛔️ parsing JSON:', e);
      return null;
    }
  }
}
