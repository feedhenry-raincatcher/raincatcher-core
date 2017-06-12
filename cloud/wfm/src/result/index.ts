interface Result {
  /**
   * The Type's name in order for it to be serializable and sent over the wire
   * from the cloud app to the front-end, where each implementation will have a different behavior
   */
  type: string;
}
export default Result;
