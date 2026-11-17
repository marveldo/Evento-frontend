// The profile page keeps its state in the URL: ?tab=past&role=hosting&price=free&view=grid&page=2.
// Plain module, so both server pages and client components can use it.

export type ProfileTab = "upcoming" | "past";
export type ProfileRole = "hosting" | "attending";
export type ProfilePrice = "free" | "paid";
export type ProfileView = "list" | "grid";

export interface ProfileQuery {
  tab: ProfileTab;
  role?: ProfileRole;
  price?: ProfilePrice;
  view: ProfileView;
  page: number;
}

export const FILTER_GROUPS = [
  {
    key: "role",
    label: "Your role",
    options: [
      { value: "hosting", label: "Hosting" },
      { value: "attending", label: "Attending" },
    ],
  },
  {
    key: "price",
    label: "Ticket",
    options: [
      { value: "free", label: "Free events" },
      { value: "paid", label: "Paid events" },
    ],
  },
] as const;

type Params = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProfileQuery(params: Params): ProfileQuery {
  const role = one(params.role);
  const price = one(params.price);
  const page = Number(one(params.page));
  return {
    tab: one(params.tab) === "past" ? "past" : "upcoming",
    role: role === "hosting" || role === "attending" ? role : undefined,
    price: price === "free" || price === "paid" ? price : undefined,
    view: one(params.view) === "grid" ? "grid" : "list",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

// A link to the profile with some of the state changed. Changing anything but the page goes back to page 1.
export function profileHref(current: ProfileQuery, changes: Partial<ProfileQuery>) {
  const next = { ...current, page: 1, ...changes };
  const params = new URLSearchParams();
  if (next.tab !== "upcoming") params.set("tab", next.tab);
  if (next.role) params.set("role", next.role);
  if (next.price) params.set("price", next.price);
  if (next.view !== "list") params.set("view", next.view);
  if (next.page > 1) params.set("page", String(next.page));
  const text = params.toString();
  return text ? `/profile?${text}` : "/profile";
}

// The filters that are on, as chips: the label, plus the change that turns it off.
export function activeFilters(query: ProfileQuery) {
  return FILTER_GROUPS.flatMap((group) =>
    group.options
      .filter((option) => query[group.key] === option.value)
      .map((option) => ({ label: option.label, clear: { [group.key]: undefined } as Partial<ProfileQuery> })),
  );
}
