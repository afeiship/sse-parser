import Abstract from './abstract';

export default class Standard extends Abstract {
  public parse(inMessage: string): any {
    const message = inMessage.trim() || '';
    const dataValue = message.split(':').slice(1).join(':');
    return JSON.parse(dataValue);
  }
}
