import {BaseTask, TaskStatus, UrlResult} from '@raincatcher/wfm';
import * as _ from 'lodash';

export class DocumentSignoffTask extends BaseTask {
  /**
   * The URL for accessing the scanned file url
   */
  public result: UrlResult;
  constructor(public userId: string) {
    super();
  }
  public getOptionsSchema() {
    return {};
  }
  public run() {
    this.updateStatus(TaskStatus.ASSIGNED);
  }

  public addUploadedFileUrl(url: string) {
    if (this.getStatus() < TaskStatus.ASSIGNED && !this.userId) {
      throw new Error('This Task must be assigned to a user before it is executed');
    }

    this.result = new UrlResult(url);
    this.updateStatus(TaskStatus.DONE);
  }
}
