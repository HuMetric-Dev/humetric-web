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

export type QueryResponse = {
  ts: number;
  parsed: ParsedQuery;
  results: PersonResult[];
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
