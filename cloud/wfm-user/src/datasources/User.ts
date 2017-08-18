/**
 * User interface that defines requred fields for WFM integration.
 * Fields are used in portal application
 */
export interface User {

  /**
   * Unique id used to identify user
   */
  id: string | number;

  /**
   * Unique name (can be the same as id)
   */
  username: string;

  /**
   * Human redable name
   */
  name: string;
}
