
/**
 * Interface used to construct standardized response for api error handlers.
 */
export class ApiError extends Error {

  /**
   * @param code - Error code used to determine error type
   * @param message - human redable message
   * @param statusCode - status code used to setup
   * @param originalError - can contain original error that was returned
   */
  constructor(public readonly code: string, public readonly message: string, public statusCode: number = 500,
              public originalError?: Error) {
    super(message);
  }
}
