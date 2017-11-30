/**
 * @module @raincatcher/wfm
 */

import * as Promise from 'bluebird';
export interface UserService {
  readUser(): Promise<{id: string}>;
}
