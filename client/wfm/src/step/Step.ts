/**
 * Definition for a {@link Task} containing its type identifier and runtime options for customizing behavior.
 * Should be contained in a {@link Process} definition
 */
export interface Step {
  /**
   * Code that matches the identifier in {@link TaskHandler}
   */
  code: string;
  name: string;
  /**
   * Options object that act as runtime parameters for its equivalent {@link Step}
   */
  templates?: {
    form?: string;
    view?: string;
  };
}
