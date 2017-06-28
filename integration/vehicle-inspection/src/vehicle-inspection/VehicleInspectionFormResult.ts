import {Result} from '@raincatcher/wfm';
import {VehicleInspectionFormData} from './VehicleInspectionFormData';
export class VehicleInspectionFormResult implements Result {
  public type = 'VehicleInspectionFormResult';
  constructor(public data: VehicleInspectionFormData) {
  }
}
