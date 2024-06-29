const parseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('⛔️ parsing JSON:', e, str);
    return null;
  }
};

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
    return parseJSON(message);
  }

  static prefixedJson(inMessage: string) {
    const message = inMessage.trim() || '';
    const idx = message.indexOf(':');
    if (idx === -1) return null;
    const dataValue = message.slice(idx + 1);
    return parseJSON(dataValue);
  }
}
