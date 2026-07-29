const ANONYMOUS_ID_KEY = "songroulette_anonymous_id";

export function getAnonymousId() {
  const existingAnonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);

  if (existingAnonymousId) {
    return existingAnonymousId;
  }

  const newAnonymousId = crypto.randomUUID();

  localStorage.setItem(ANONYMOUS_ID_KEY, newAnonymousId);

  return newAnonymousId;
}