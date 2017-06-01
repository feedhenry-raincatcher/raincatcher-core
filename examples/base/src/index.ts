/**
 * Public interface
 *
 * Must a named export with a name reflecting the purpose of the module
 */
export interface Base {
  /** Simple sample method */
  foo(param: string): void;
}

export interface Logger {
  log(message: string): any;
}

/**
 * Example of a separate options interface
 * Usually all keys should be optional
 */
export interface RaincatcherBaseOptions {
  prefix?: string;
}

/**
 * Our main implementation
 *
 * Must be the default export
 */
export default class RaincatcherBase implements Base {
  public prefix?: string;
  /**
   * Module's constructor should receive all dependencies as parameters,
   * could also expose an options interface
   * @param logger example of an external dependency
   * @param options example of options/dependencies that are passed via an options object
   */
  constructor(protected logger: Logger, protected options?: RaincatcherBaseOptions) {
    if (options) {
      this.prefix = options.prefix;
    }
  }

  /** Implementation of interface method */
  public foo(msg: string) {
    return this.logger.log(this.prefix + msg);
  }

  /** Sample extra function outside of public interface */
  public customFunction() {
    return `${this.prefix} Hello World`;
  }

  /** Sample extra non-tested function */
  public notTested() {
    return 'Boo';
  }
}
