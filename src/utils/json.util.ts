export function safeParseJSON<T>(value: any, defaultValue: T): T {
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return parsed as T;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}
