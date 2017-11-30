/**
 * @module @raincatcher/wfm
 */

/**
 * A single unit of work, containing its identifier and runtime options for customizing behavior.
 */
export interface Step {

  /**
   * Unique identifier for this step
   */
  id: string;

  /**
   * Code that matches the identifier of the module that should handle the execution of this {@link Step}
   */
  code: string;

  /**
   * Short name intended to be displayed in the User Interface
   */
  name: string;

  /**
   * Options object that act as runtime parameters for the execution of this {@link Step}
   */
  templates?: {
    /** The template for the {@link Step}'s form, should allow a User to fill the data required for its completion */
    form?: string;
    /** The template for the {@link Step}'s view, should implement the visualization of its results */
    view?: string;
  };
}
