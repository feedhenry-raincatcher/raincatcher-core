export interface Result {
  /**
   * The Type's name in order for it to be serializable and sent over the wire
   * from the cloud app to the front-end, where each implementation will have a different behavior
   */
  type: string;
}

import BooleanResult from './BooleanResult';
export { BooleanResult };

// Use UrlResult as default export since it's a simple implementation that can handle lots of use cases
import UrlResult from './UrlResult';
export default UrlResult;
