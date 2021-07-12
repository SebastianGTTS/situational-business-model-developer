/**
 * Convert a name to an id
 *
 * @param name the name
 */
export function nameToId(name: string): string {
  return name.toLowerCase().replace(/ /g, '-');
}

/**
 * Get the next unique id by name
 *
 * @param name the name to get the id from
 * @param currentIdList all ids currently used
 */
export function getId(name: string, currentIdList: string[]) {
  const id = nameToId(name);
  const ids = currentIdList.filter((i) => i.startsWith(id));
  if (ids.length === 0) {
    return id;
  }
  const currentCount = Math.max(
    ...ids
      .map((i) => i.substring(id.length + 1))
      .filter((i) => /^[0-9]+$/.test(i))
      .map((i) => parseInt(i, 10)),
    0
  );
  return id + '-' + (currentCount + 1);
}
