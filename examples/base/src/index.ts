export interface Base {
  foo(param: string): void;
}

export interface Logger {
  log(message: string): any;
}

export default class RaincatcherBase implements Base {
  constructor(protected logger: Logger) {
  }

  public foo(msg: string) {
    return this.logger.log(msg);
  }

  public customFunction() {
    return 'Hello World';
  }

  public notTested() {
    return 'Boo';
  }
}
