declare const __BUILD_DATA__: {
  sawthat: {
    username: string;
    bands: Band[];
  };
};

export interface Concert {
  date: string;
  location: string;
}

export interface BandColor {
  bg: string;
  isLight: boolean;
}

export interface Band {
  id: string;
  band: string;
  picture: string;
  concerts: Concert[];
  color: BandColor | null;
}

export interface SawThatState {
  username: string;
  bands: Band[];
  loading: boolean;
  error: string | null;
}

const buildData = __BUILD_DATA__.sawthat;

export const sawThatState = $state<SawThatState>({
  username: buildData.username,
  bands: buildData.bands,
  loading: false,
  error: null,
});

export function hasSawThatConfig() {
  return buildData.bands.length > 0;
}
