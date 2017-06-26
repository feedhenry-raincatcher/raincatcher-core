import {ExampleWorkFlow, ExampleWorkOrder, } from "./Models";
import { Result} from "./Results";


export interface WorkFlowService {
  create(workflow: ExampleWorkFlow);
  list(): ExampleWorkFlow[] ;
  read(workflowId: string);
  update(workflow: ExampleWorkFlow);
  remove(workflowId: string);
}

export interface WorkFlowActionsService extends WorkFlowService {
  /**
   * Handling the beginning of a workflow.
   * The beginning of a workflow for a single workorder requires checking the current status of the workflow.
   *
   * To do this we need to check if a result already exists related to this workorder.
   * If it does, then then we can proceed to the next step in the workflow.
   */
  begin(workorderId: string);

  /**
   * Handling the complete topic for workflow steps.
   * This handler updates the result of the current step
   */
  complete(workorderId: string, submission: any, stepCode: string);

  /**
   * Workflow summary
   * @param workorderId
   */
  summary(workorderId: string);

  /**
   * Handing a workflow back topic.
   * In this case, we want to decrement the nextStepIndex of a result if it exists.
   */
  previous(workorderId: string);
}


export interface WorkOrderService {
  create(workOrder: ExampleWorkOrder);
  list(): ExampleWorkOrder[] ;
  read(workOrderId: string);
  update(workOrder: ExampleWorkOrder);
  remove(workOrderId: string);
}

export interface ResultService {
  create(result: Result);
  list(): Result[] ;
  read(resultId: string);
  update(result: Result);
  remove(resultId: string);
}
