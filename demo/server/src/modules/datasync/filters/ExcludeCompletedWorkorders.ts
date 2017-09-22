/**
 * Excludes WorkOrders with a Complete date over a set number of days ago
 * @param queryParams
 */
export function excludeCompleteWorkOrders(days: number) {
  if (days < 0) {
    throw new Error(`Days must be a number greater than or equal to zero, got ${days}`);
  }
  return function(queryParams: any) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    const excludeQuery = {
      '$or': [
        { 'statusHistory.Complete': { '$exists': false } },
        { 'statusHistory.Complete': { '$gt': daysAgo.getTime() } }
      ]
    };

    // Add this query to $and so it doesn't overwrite other queries
    queryParams.$and = queryParams.$and || [];
    queryParams.$and.push(excludeQuery);
  };
}
