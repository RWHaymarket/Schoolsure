export interface School {
  id: string;
  name: string;
  suburb: string;
  postcode: string;
  state: string;
  sector: "Independent" | "Catholic";
  fees?: number;
}

export const schools: School[] = [
  {
    id: "knox",
    name: "Knox Grammar School",
    suburb: "Wahroonga",
    postcode: "2076",
    state: "NSW",
    sector: "Independent",
    fees: 43000,
  },
  {
    id: "trinity",
    name: "Trinity Grammar School",
    suburb: "Summer Hill",
    postcode: "2130",
    state: "NSW",
    sector: "Independent",
    fees: 38000,
  },
  {
    id: "loreto",
    name: "Loreto Kirribilli",
    suburb: "Kirribilli",
    postcode: "2061",
    state: "NSW",
    sector: "Catholic",
    fees: 28000,
  },
  {
    id: "pymble",
    name: "Pymble Ladies' College",
    suburb: "Pymble",
    postcode: "2073",
    state: "NSW",
    sector: "Independent",
    fees: 42000,
  },
  {
    id: "abbotsleigh",
    name: "Abbotsleigh",
    suburb: "Wahroonga",
    postcode: "2076",
    state: "NSW",
    sector: "Independent",
    fees: 40000,
  },
  {
    id: "ravenswood",
    name: "Ravenswood School for Girls",
    suburb: "Gordon",
    postcode: "2072",
    state: "NSW",
    sector: "Independent",
    fees: 38000,
  },
  {
    id: "stlukes",
    name: "St Luke's Grammar School",
    suburb: "Dee Why",
    postcode: "2099",
    state: "NSW",
    sector: "Independent",
    fees: 32000,
  },
  {
    id: "kings",
    name: "The King's School",
    suburb: "North Parramatta",
    postcode: "2151",
    state: "NSW",
    sector: "Independent",
    fees: 45000,
  },
  {
    id: "shore",
    name: "Shore School",
    suburb: "North Sydney",
    postcode: "2060",
    state: "NSW",
    sector: "Independent",
    fees: 42000,
  },
  {
    id: "newington",
    name: "Newington College",
    suburb: "Stanmore",
    postcode: "2048",
    state: "NSW",
    sector: "Independent",
    fees: 40000,
  },
];
