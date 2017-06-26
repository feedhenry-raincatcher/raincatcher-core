import {Step} from './Models';

export interface VehicleInspectionSubmission {
  lights: boolean;
  tires: boolean;
}

export interface VehicleInspection {
  submitter: string;
  timestamp: number;
  status: string;
  type: string;
  submission: VehicleInspectionSubmission;
  step: ExampleStep;
}

export interface RiskAssesmentSubmission {
  signature: string;
  complete: boolean;
}

export interface RiskAssessment {
  submitter: string;
  timestamp: number;
  status: string;
  type: string;
  submission: RiskAssesmentSubmission;
  step: ExampleStep;
}

// TODO we need to refactor this structure and move result id to object
export interface StepResults {
  'vehicle-inspection': VehicleInspection;
  'risk-assessment': RiskAssessment;
}

export interface Result {
  id: string;
  status: string;
  nextStepIndex: string;
  workorderId: string;
  stepResults: StepResults[];
}
