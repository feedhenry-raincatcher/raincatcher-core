/**
 * List of available status for {@link WorkOrder}s and their individual {@link Step}s
 */
export enum STATUS {
  /** Required actions have all been executed */
  COMPLETE = 'complete',
  /** Version of the COMPLETE status for display by the UI */
  COMPLETE_DISPLAY = 'Complete',
  /** Assigned to a user and awaiting completion */
  PENDING = 'pending',
  /** Version of the PENDING status for display by the UI */
  PENDING_DISPLAY = 'In Progress',
  /** Just created */
  NEW = 'new',
  /** Version of the NEW status for display by the UI */
  NEW_DISPLAY = 'New',
  /** User that should execute the {@link Step} has not yet been determined */
  UNASSIGNED = 'unassigned',
  /** Version of the UNASSIGNED status for display by the UI */
  UNASSIGNED_DISPLAY = 'Unassigned'
}
