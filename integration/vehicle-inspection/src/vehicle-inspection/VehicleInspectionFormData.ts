/**
 * Data for the form to be supplied from the ui as it is filled by the user
 * Partially based off the form in https://github.com/feedhenry-raincatcher/raincatcher-vehicle-inspection/
 */
export interface VehicleInspectionFormData {
  fuel: number;
  tires: boolean;
  lights: boolean;
  /**
   * Array of urls of uploaded pictures, intended to be used when 'requirePictures' was configured in the Task
   */
  pictures?: [string];
}
