export function getUnique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function getMappedUnique<T, Y>(
  values: T[],
  predicate: (value: T) => Y
): Y[] {
  return getUnique(values.map(predicate));
}
