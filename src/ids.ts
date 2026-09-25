// Changes on every JS load so ids from a previous runtime never match the new registry.
const generation = Math.random().toString(36).slice(2, 8);
let counter = 0;

export function createAccessoryId(): string {
  counter += 1;
  return `${generation}:${counter}`;
}
