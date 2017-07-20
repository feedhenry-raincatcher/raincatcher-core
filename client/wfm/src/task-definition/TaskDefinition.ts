import { JsonSchema } from '../../src/JsonSchema';
export interface TaskDefinition {
  /**
   * Code that matches the identifier in {@link TaskHandler}
   */
  code: string;
  /**
   * An object that is compatible with the {@link JsonSchema} of the {@link TaskHandler}
   */
  options?: object;
}
