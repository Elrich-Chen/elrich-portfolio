/** Display range for experience rows / case meta. */
export function formatExperienceDates(start: string, end?: string, override?: string) {
  if (override) return override;
  const year = (value: string) => value.slice(0, 4);
  return `${year(start)} — ${end ? year(end) : 'Present'}`;
}
