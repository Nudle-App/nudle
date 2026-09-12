export type Employer = {
  id: string;
  name: string;
  sector: string;
};

/** Known Zimbabwean employers on file with Blue Finance. */
export const EMPLOYERS: Employer[] = [
  { id: "econet", name: "Econet Wireless Zimbabwe", sector: "Telecommunications" },
  { id: "delta", name: "Delta Corporation", sector: "Beverages & FMCG" },
  { id: "zimplats", name: "Zimplats Holdings", sector: "Mining" },
  { id: "innscor", name: "Innscor Africa", sector: "Manufacturing & Retail" },
  { id: "old-mutual", name: "Old Mutual Zimbabwe", sector: "Financial services" },
  { id: "cbz", name: "Scotiabank Zimbabwe", sector: "Banking" },
  { id: "nmb", name: "NMB Bank", sector: "Banking" },
  { id: "zesa", name: "ZESA Holdings", sector: "Energy & utilities" },
  { id: "zimra", name: "Zimbabwe Revenue Authority (ZIMRA)", sector: "Government" },
  { id: "psc", name: "Public Service Commission", sector: "Government" },
  { id: "netone", name: "NetOne Cellular", sector: "Telecommunications" },
  { id: "tm-pnp", name: "TM Pick n Pay", sector: "Retail" },
  { id: "schweppes", name: "Schweppes Zimbabwe", sector: "Beverages" },
  { id: "nash-paints", name: "Nash Paints", sector: "Manufacturing" },
  { id: "unki", name: "Unki Mines", sector: "Mining" },
];
