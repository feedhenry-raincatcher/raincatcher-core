import {BaseTask, TaskStatus} from '@raincatcher/wfm';
import * as _ from 'lodash';
import {VehicleInspectionFormData} from './VehicleInspectionFormData';
import {VehicleInspectionFormResult} from './VehicleInspectionFormResult';

/**
 * A Task for realizing an inspection in a vehicle
 *
 * The following items of an automobile can be checked with this module:
 * - Fuel
 * - Tires
 * - Lights
 */
export class VehicleInspectionTask extends BaseTask {
  public result: VehicleInspectionFormResult;
  public userId: string;

  public getOptionsSchema() {
    return {
      properties: {
        includeFullEngineReview: {
          type: 'boolean'
        },
        requirePictures: {
          type: 'boolean'
        }
      },
      required: ['includeFullEngineReview', 'requirePictures']
    };
  }
  public run() {
    this.updateStatus(TaskStatus.ASSIGNED);
  }

  public fillFormData(data: VehicleInspectionFormData) {
    if (this.getStatus() < TaskStatus.ASSIGNED && !this.userId) {
      throw new Error('This Task must be assigned to a user before its form is filled');
    }

    if (this.options.requirePictures) {
      if (_.isEmpty(data.pictures)) {
        throw new Error('Picture data for the Vehicle Inspection is required');
      }
    }
    this.result = new VehicleInspectionFormResult(data);
    this.updateStatus(TaskStatus.DONE);
  }
}
