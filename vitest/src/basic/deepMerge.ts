export function deepMerge(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): Record<string, any> {
  // Merge arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return [...obj1, ...obj2];
  }

  const merged: Record<string, any> = { ...obj1 };

  for (const key of Object.keys(obj2)) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // Recursively merge nested objects
    if (
      value1 &&
      value2 &&
      typeof value1 === "object" &&
      typeof value2 === "object" &&
      !Array.isArray(value1) &&
      !Array.isArray(value2)
    ) {
      merged[key] = deepMerge(value1, value2);
    } else {
      merged[key] = value2;
    }
  }

  return merged;
}
