// NOTE: browserify can provide an implementation for node's url module
import * as nodeUrl from 'url';
import {Result} from './index';

/**
 * Represents a Result that can be accessed via a URL
 */
export default class UrlResult implements Result {
  public type: 'UrlResult';
  /**
   * Convenience object parsed by url.parse
   */
  public urlObject: nodeUrl.UrlObject;
  constructor(public url: string) {
    // validate url via node's url object
    this.urlObject = nodeUrl.parse(this.url);
  }
}
