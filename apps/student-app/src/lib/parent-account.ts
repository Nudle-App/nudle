export function wait(ms = 800) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const ACTIVE_CHILD_KEY = "kleva.activeChildId";

export function getActiveChildId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_CHILD_KEY);
}

export function setActiveChildId(id: string | null) {
  if (typeof window === "undefined") return;
  if (!id) {
    window.localStorage.removeItem(ACTIVE_CHILD_KEY);
    return;
  }
  window.localStorage.setItem(ACTIVE_CHILD_KEY, id);
}
