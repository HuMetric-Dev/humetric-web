// Mirror of humetric_api.dtos. Keep field names / shapes in sync.

export type ParsedQuery = {
  free_text: string;
  must_skills: string[];
  nice_skills: string[];
  location: string | null;
  min_followers: number | null;
  min_years_experience: number | null;
};

export type PersonResult = {
  rank: number;
  person_id: string;
  name: string;
  headline: string;
  location: string;
  follower_count: number;
  last_active_days_ago: number | null;
  source: string;
  raw_url: string;
  skills: string[];
  score: number;
  explanation: string;
};

export type OrgResult = {
  rank: number;
  org_id: string;
  name: string;
  headline: string;
  location: string;
  source: string;
  raw_url: string;
  org_kind: string;
  score: number;
  explanation: string;
};

export type EntityType = "person" | "organization";

export type QueryResponse = {
  ts: number;
  parsed: ParsedQuery;
  // `results` is the person block, kept under the old name for back-compat.
  results: PersonResult[];
  organizations: OrgResult[];
};

export type HistoryItem = {
  ts: number;
  free_text: string;
};

export type HistoryResponse = {
  items: HistoryItem[];
};

export type ApiErrorBody = {
  error: string;
  detail: string;
};

// --- auth ---------------------------------------------------------------
// Mirror of humetric_api.auth_dtos. Keep in sync.

export type UserDTO = {
  id: string;
  email: string;
  display_name: string;
  person_id: string | null;
  claim_state: "linked" | "pending";
  created_at: number;
};

export type RegisterRequestDTO = {
  email: string;
  password: string;
  display_name: string;
  github_username?: string | null;
  linkedin_url?: string | null;
};

export type RegisterResponseDTO = {
  user: UserDTO;
  claim_state: "linked" | "pending";
  candidates: PersonResult[];
};

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type ClaimRequestDTO = {
  person_id?: string | null;
  create_new?: boolean;
  new_person_name?: string | null;
  new_person_headline?: string | null;
};
