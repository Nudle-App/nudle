import northern from "@/assets/schools/northern.svg";
import lisgar from "@/assets/schools/lisgar.svg";
import westernCanada from "@/assets/schools/western-canada.svg";
import oakridge from "@/assets/schools/oakridge.svg";
import jarvis from "@/assets/schools/jarvis.svg";
import magee from "@/assets/schools/magee.svg";

export type DummySchool = {
  id: string;
  name: string;
  city: string;
  logo: string;
};

export const DUMMY_SCHOOLS: DummySchool[] = [
  { id: "northern", name: "Northern Secondary School", city: "Toronto", logo: northern },
  { id: "lisgar", name: "Lisgar Collegiate Institute", city: "Ottawa", logo: lisgar },
  { id: "western-canada", name: "Western Canada High School", city: "Calgary", logo: westernCanada },
  { id: "oakridge", name: "Oakridge Secondary School", city: "London", logo: oakridge },
  { id: "jarvis", name: "Jarvis Collegiate Institute", city: "Toronto", logo: jarvis },
  { id: "magee", name: "Magee Secondary School", city: "Vancouver", logo: magee },
];

export function dummySchoolForId(id: string | null | undefined): DummySchool {
  if (!id) return DUMMY_SCHOOLS[0]!;
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % DUMMY_SCHOOLS.length;
  }
  return DUMMY_SCHOOLS[hash]!;
}
