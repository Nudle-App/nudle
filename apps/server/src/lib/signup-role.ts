import { AsyncLocalStorage } from "node:async_hooks";

const signupRole = new AsyncLocalStorage<"student" | "parent">();

export function runWithSignupRole(role: "student" | "parent", next: () => void) {
  signupRole.run(role, next);
}

export function getSignupRole(): "student" | "parent" {
  return signupRole.getStore() ?? "student";
}

export function roleFromAuthRequest(req: {
  headers: { [key: string]: string | string[] | undefined };
  url?: string;
}): "student" | "parent" {
  const header = String(req.headers["x-kleva-role"] ?? "").toLowerCase();
  let query = "";
  try {
    query = new URL(req.url ?? "", "http://localhost").searchParams.get("role") ?? "";
  } catch {
    query = "";
  }
  return header === "parent" || query === "parent" ? "parent" : "student";
}
