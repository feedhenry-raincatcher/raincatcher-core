export interface TaskHandler {
  /**
   * The identification of this Handler, should match the field in correspondent {@link Task}s
   */
  code: string;
  /**
   * The name for display of this type of {@link Task}
   */
  name: string;
  /**
   * A summary description for the actions to be realized in the related {@link Task}s
   */
  description: string;
  /**
   * Set of runtime configuration options for customizing a {@link Task}
   */
  optionsSchema: object;
}
