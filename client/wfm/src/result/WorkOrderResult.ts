import {StepResult} from './StepResult';
export interface WorkOrderResult {
  id: string;
  status: string;
  nextStepIndex: number;
  workorderId: string;
  assignee: string;
  stepResults?: {
    [stepCode: string]: StepResult
  };
}
