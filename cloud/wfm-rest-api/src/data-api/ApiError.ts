
/**
 * Interface used to construct standarized response for api error handlers.
 */
export class ApiError extends Error {
  constructor(public code: string, public message: string) {
    super();
  }
}
