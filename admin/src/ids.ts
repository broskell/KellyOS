export function newId(prefix: string): string {
  const raw = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  return `${prefix}_${raw}`;
}
