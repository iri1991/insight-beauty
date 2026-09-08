export function plain(value) {
  return JSON.parse(JSON.stringify(value));
}
