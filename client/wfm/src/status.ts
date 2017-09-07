/**
 * List of available status for {@link WorkOrder}s and their individual {@link Step}s
 */
export enum STATUS {
  /** Just created */
  NEW = 'New',
  /** Required actions have all been executed */
  COMPLETE = 'Complete',
  /** Assigned to a user and awaiting completion */
  PENDING = 'Pending'
}
