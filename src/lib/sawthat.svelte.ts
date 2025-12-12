export interface Concert {
  date: string;
  location: string;
}

export interface Band {
  id: string;
  band: string;
  picture: string;
  genre: string[];
  concerts: Concert[];
  user_id: string;
}

export interface SawThatState {
  bands: Band[];
  loading: boolean;
  error: string | null;
}

export const sawThatState = $state<SawThatState>({
  bands: [],
  loading: true,
  error: null,
});

const USER_ID = import.meta.env.VITE_SAWTHAT_BAND_ID;
const API_BASE = import.meta.env.DEV
  ? "/api/sawthat"
  : "https://server.sawthat.band/api";

export async function fetchBands() {
  if (!USER_ID) {
    sawThatState.loading = false;
    return;
  }

  sawThatState.loading = true;
  sawThatState.error = null;

  try {
    const response = await fetch(`${API_BASE}/bands?id=${USER_ID}`);

    if (!response.ok) {
      throw new Error(`SawThat API error: ${response.status}`);
    }

    const data: Band[] = await response.json();
    sawThatState.bands = data;
  } catch (error) {
    console.error("Failed to fetch bands:", error);
    sawThatState.error =
      error instanceof Error ? error.message : "Failed to load bands data";
  } finally {
    sawThatState.loading = false;
  }
}

export function hasSawThatConfig() {
  return !!USER_ID;
}
