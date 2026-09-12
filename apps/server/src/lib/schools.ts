export type School = {
  id: string;
  name: string;
  shortName: string;
};

export const SCHOOLS: School[] = [
  { id: "kleva-high", name: "Kleva High School", shortName: "KH" },
  { id: "kleva-primary", name: "Kleva Primary School", shortName: "KP" },
];

export const DEFAULT_SCHOOL_ID = SCHOOLS[0]!.id;

export function schoolById(id: string | null | undefined): School | null {
  if (!id) return null;
  return SCHOOLS.find((school) => school.id === id) ?? null;
}

export function schoolForUserId(userId: string): School {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash + userId.charCodeAt(i)) % SCHOOLS.length;
  }
  return SCHOOLS[hash]!;
}
