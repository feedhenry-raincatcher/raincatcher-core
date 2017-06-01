export interface Base {
  /** Simple sample method */
  foo(param: string): void;
}

export interface Logger {
  log(message: string): any;
}

export default class RaincatcherBase implements Base {
  constructor(protected logger: Logger) {
  }

  /** Implementation of interface method */
  public foo(msg: string) {
    return this.logger.log(msg);
  }

  /** Sample extra function outside of public interface */
  public customFunction() {
    return 'Hello World';
  }

  /** Sample extra non-tested function */
  public notTested() {
    return 'Boo';
  }
}
