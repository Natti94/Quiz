import { makeMongoStore } from "./_lib/mongoStore.js";

export function getDataStore(name) {
  return makeMongoStore(name);
}
