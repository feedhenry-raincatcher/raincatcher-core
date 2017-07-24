/**
 * Definition for a {@link Task} containing its type identifier and runtime options for customizing behavior.
 * Should be contained in a {@link Process} definition
 */
export interface TaskDefinition {
  /**
   * Code that matches the identifier in {@link TaskHandler}
   */
  code: string;
  /**
   * Options object that act as runtime parameters for its equivalent {@link Task}
   */
  options?: object;
}
