import { WorkOrderResult } from '../result/WorkOrderResult';
import { DataService } from './DataService';

export interface ResultService extends DataService<WorkOrderResult> {
  readByWorkorder(workorderId): WorkOrderResult;
}
