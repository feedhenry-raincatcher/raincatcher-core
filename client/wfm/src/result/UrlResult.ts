// NOTE: browserify can provide an implementation for node's url module
import * as nodeUrl from 'url';
import {isWebUri} from 'valid-url';
import {Result} from './Result';

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
      throw new Error('Invalid Url');
    }
    this.urlObject = nodeUrl.parse(this.url);
  }
}
