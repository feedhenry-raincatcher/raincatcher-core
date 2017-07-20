import {JsonSchema} from '../JsonSchema';
export interface TaskHandler {
  /**
   * The identification of this Handler, should match the field in correspondent Tasks
   */
  code: string;
  /**
   * The name for display of this type of Task
   */
  name: string;
  /**
   * A summary description for the actions to be realized in the related Tasks
   */
  description: string;
  /**
   * Set of runtime configuration options
   * This is intended to be rendered as a `<form>` in a front-end application
   * for instance by utilizing http://schemaform.io/
   */
  optionsSchema: JsonSchema;
}
