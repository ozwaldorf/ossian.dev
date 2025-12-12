declare const __BUILD_DATA__: {
  sawthat: {
    bands: Band[];
  };
};

export interface Concert {
  date: string;
  location: string;
}

export interface Band {
  id: string;
  band: string;
  picture: string;
  concerts: Concert[];
}

export interface SawThatState {
  bands: Band[];
  loading: boolean;
  error: string | null;
}

const buildData = __BUILD_DATA__.sawthat;

export const sawThatState = $state<SawThatState>({
  bands: buildData.bands,
  loading: false,
  error: null,
});

export function hasSawThatConfig() {
  return buildData.bands.length > 0;
}
