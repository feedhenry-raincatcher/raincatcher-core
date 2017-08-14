
/**
 * Interface used to construct standardized response for api error handlers.
 */
export class ApiError extends Error {
  constructor(public readonly code: string, public readonly message: string, public statusCode: number = 500) {
    super(message);
  }
}
