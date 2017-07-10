// NOTE: browserify can provide an implementation for node's url module
import { ConsoleLogger, Logger } from '@raincatcher/logger';
import * as nodeUrl from 'url';
import {isWebUri} from 'valid-url';
import {Result} from './Result';

const log: Logger = new ConsoleLogger();

/**
 * Represents a {@link Result} that can be accessed via a URL
 */
export class UrlResult implements Result {
  public type = 'UrlResult';
  /**
   * Convenience object parsed by url.parse()
   */
  public urlObject: nodeUrl.UrlObject;
  constructor(public url: string) {
    if (!isWebUri(url)) {
      log.error({tag: 'wfm result', src: 'UrlResult.ts'}, 'Invalid Url');
      throw new Error('Invalid Url');
    }
    this.urlObject = nodeUrl.parse(this.url);
  }
}
