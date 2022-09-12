export class Logger {
  static log(...messages: any) {
    console.log(...messages);
  }

  static info(...messages: any) {
    console.info('[!]', ...messages);
  }

  static error(...error: any) {
    console.error('[ERROR]', ...error);
  }
}
