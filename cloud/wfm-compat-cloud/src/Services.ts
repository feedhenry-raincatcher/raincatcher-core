import {ExampleWorkFlow, ExampleWorkOrder} from "./Models";

// Services that will be exported using web api.

export interface WorkFlowService {
  create(workflow: ExampleWorkFlow);
  list(): ExampleWorkFlow[] ;
  read(workflowId: string);
  update(workflow: ExampleWorkFlow);
  remove(workflowId: string);
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
