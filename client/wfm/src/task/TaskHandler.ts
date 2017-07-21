import { ProcessInstance } from '../process-instance/ProcessInstance';
import { Result } from '../result/Result';
import { Task } from './Task';
export interface TaskHandler {
  id: string;
  displayName: string;
  /**
   * Starts the execution of a Task
   */
  execute(task: Task, processInstance: ProcessInstance): void;
  /**
   * Should be called when a Task is done
   */
  next(task: Task, processInstance: ProcessInstance): Result;
  /**
   * Should be called upon a user request to move to the previous Task
   */
  previous(task: Task, processInstance: ProcessInstance): Result;
}

import { BooleanResult } from '../result/BooleanResult';
/**
 * Throwaway draft of a custom TaskHandler
 */
class VehicleInspectionTaskHandler implements TaskHandler {
  public id: 'vehicle-inspection';
  public displayName: 'Vehicle Inspection';
  public portalDirective = 'vehicleInspection';
  public mobileDirective = 'vehicleInspectionForm';
  public execute(task: Task, processInstance: ProcessInstance): void {
    // render mobileDirective to proper container
  }
  public next(task: Task, processInstance: ProcessInstance): Result {
    // should get called from angular controller,
    // controller.next = () => {registry.get('vehicle-inspection').next(...);}
    // TODO: update results to match needs of current UI
    return new BooleanResult(true);
  }
  public previous(task: Task, processInstance: ProcessInstance): Result {
    // should get called from angular controller,
    // controller.back = () => {registry.get('vehicle-inspection').previous(...);}
    return new BooleanResult(true);
  }
}