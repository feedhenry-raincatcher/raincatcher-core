import * as Promise from 'bluebird';
import { WorkOrderResult } from '../result/WorkOrderResult';
import { DataService } from './DataService';

export interface ResultService extends DataService<WorkOrderResult> {
  readByWorkorder(workorderId: string): Promise<WorkOrderResult | undefined>;
}
