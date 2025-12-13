import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import deno from "@deno/vite-plugin";
import Icons from "unplugin-icons/vite";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { Jimp } from "jimp";
import albumArt from "album-art";

// Data cache
const CACHE_PATH = "src/.data.json";
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function loadCache() {
  try {
    const cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
    if (cache.timestamp && Date.now() - cache.timestamp < CACHE_MAX_AGE) {
      return cache;
    }
  } catch { }
  return null;
}

function saveCache(data) {
  writeFileSync(
    CACHE_PATH,
    JSON.stringify({ data, timestamp: Date.now() }, null, 2),
  );
}

const YOUTUBE_API_KEY = process.env.VITE_YOUTUBE_API_KEY;

// Data source configuration
const GITHUB_USERNAME = "ozwaldorf";
const GITHUB_PINNED = [
  "lutgen-rs",
  "flake",
  "carburetor",
  "punfetch",
  "ozboar/zoom-sync",
  "fleek-network/lightning",
];
const YOUTUBE_CHANNEL_ID = "UChDWgGHETbLiwXREBHKucAA";
const YOUTUBE_HANDLE = "officialphoz";
const SAWTHAT_USER_NAME = "ossian";
const SAWTHAT_USER_ID = "a320940a-b493-4515-9f25-d393ebb540e6";

// Build info
const commitHash = execSync("git rev-parse --short=8 HEAD").toString().trim();
const buildDate = new Date().toISOString();

// Color extraction for album art using Oklab for perceptual uniformity
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklab(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );

  return {
    L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  };
}

async function extractColor(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const image = await Jimp.read(Buffer.from(buffer));
    image.resize({ w: 50, h: 50 });

    const { width, height } = image;

    // Define center exclusion zone (middle 66%)
    const marginX = Math.floor(width / 6);
    const marginY = Math.floor(height / 6);

    // Collect unique colors and their weights (favoring bottom of image)
    const colorCounts = new Map();

    for (let y = 0; y < height; y++) {
      const yWeight = (y + 1) / height; // 0.02 at top, 1.0 at bottom
      for (let x = 0; x < width; x++) {
        // Skip center region
        if (
          x >= marginX && x < width - marginX &&
          y >= marginY && y < height - marginY
        ) {
          continue;
        }

        const pixel = image.getPixelColor(x, y);
        const rgb = pixel >> 8; // strip alpha

        if (colorCounts.has(rgb)) {
          colorCounts.get(rgb).weight += yWeight;
        } else {
          const r = (pixel >> 24) & 0xff;
          const g = (pixel >> 16) & 0xff;
          const b = (pixel >> 8) & 0xff;
          const oklab = rgbToOklab(r, g, b);
          colorCounts.set(rgb, { oklab, weight: yWeight });
        }
      }
    }

    // Weighted average in Oklab space
    // Sharpness exponent: >1 favors dominant colors, <1 blends more, 1 = linear
    const sharpness = 4;
    let sumL = 0, sumA = 0, sumB = 0;
    let totalWeight = 0;

    for (const { oklab, weight } of colorCounts.values()) {
      const w = Math.pow(weight, sharpness);
      sumL += oklab.L * w;
      sumA += oklab.a * w;
      sumB += oklab.b * w;
      totalWeight += w;
    }

    const L = sumL / totalWeight;
    const a = sumA / totalWeight;
    const b = sumB / totalWeight;

    return { bg: `oklab(${L.toFixed(3)} ${a.toFixed(3)} ${b.toFixed(3)})`, isLight: L > 0.6 };
  } catch (err) {
    console.warn(`Failed to extract color from ${imageUrl}:`, err.message);
    return null;
  }
}

// Fetch alternate album art from Spotify via album-art package
async function fetchAlbumArt(bandName, albumName = null) {
  try {
    const options = { size: "large" };
    if (albumName) options.album = albumName;
    const url = await albumArt(bandName, options);
    if (url && typeof url === "string" && url.startsWith("http")) {
      return url;
    }
    return null;
  } catch (err) {
    console.warn(
      `Failed to fetch album art for "${bandName}"${albumName ? ` (${albumName})` : ""
      }:`,
      err.message,
    );
    return null;
  }
}

// Deezer API helpers (no auth, no rate limiting)
const DEEZER_BASE = "https://api.deezer.com";

// Parse DD-MM-YYYY date format
function parseDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Find album closest to target date from album list
function findClosestAlbum(albums, targetDate) {
  if (!albums?.length) return null;
  const targetTime = parseDate(targetDate)?.getTime();
  if (!targetTime) return null;

  let bestMatch = null;
  let bestDiff = Infinity;

  for (const album of albums) {
    if (!album.release_date) continue;
    const releaseTime = new Date(album.release_date).getTime();
    if (releaseTime <= targetTime) {
      const diff = targetTime - releaseTime;
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = album.title;
      }
    }
  }
  return bestMatch;
}

// Batch fetch from Deezer with chunking (limit: 50 req/5s)
const CHUNK_SIZE = 10;
const CHUNK_DELAY = 1000;

async function batchFetchDeezerArtists(bandNames) {
  const results = [];
  for (let i = 0; i < bandNames.length; i += CHUNK_SIZE) {
    const chunk = bandNames.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(
      chunk.map(async (name) => {
        try {
          const url = `${DEEZER_BASE}/search/artist?q=${encodeURIComponent(name)
            }&limit=1`;
          const res = await fetch(url).then((r) => r.json());
          return res?.data?.[0]?.id ?? null;
        } catch {
          return null;
        }
      }),
    );
    results.push(...chunkResults);
    if (i + CHUNK_SIZE < bandNames.length) {
      await new Promise((r) => setTimeout(r, CHUNK_DELAY));
    }
  }
  return results;
}

async function batchFetchDeezerAlbums(artistIds) {
  const results = [];
  for (let i = 0; i < artistIds.length; i += CHUNK_SIZE) {
    const chunk = artistIds.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(
      chunk.map(async (id) => {
        if (!id) return null;
        try {
          const url = `${DEEZER_BASE}/artist/${id}/albums?limit=100`;
          const res = await fetch(url).then((r) => r.json());
          if (res?.error) return null;
          return res?.data ?? null;
        } catch {
          return null;
        }
      }),
    );
    results.push(...chunkResults);
    if (i + CHUNK_SIZE < artistIds.length) {
      await new Promise((r) => setTimeout(r, CHUNK_DELAY));
    }
  }
  return results;
}

// Batch fetch album art from Spotify (no rate limit needed)
async function batchFetchAlbumArt(requests) {
  return Promise.all(
    requests.map(async ({ artist, album }) => {
      try {
        const options = { size: "large" };
        if (album) options.album = album;
        const url = await albumArt(artist, options);
        return url && typeof url === "string" && url.startsWith("http")
          ? url
          : null;
      } catch {
        return null;
      }
    }),
  );
}

// Fetch and prune all dynamic content
async function fetchBuildData() {
  const cache = loadCache();
  if (cache) {
    console.log(
      `✓ Using cached data from ${new Date(cache.timestamp).toISOString()}`,
    );
    return cache.data;
  }

  const data = {
    github: { user: null, repos: [], pinned_repos: [] },
    youtube: { channel: null, videos: [] },
    sawthat: { username: SAWTHAT_USER_NAME, bands: [] },
  };

  // Fetch GitHub data
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&direction=reverse&per_page=100`,
      ),
    ]);

    if (userResponse.ok && reposResponse.ok) {
      const user = await userResponse.json();
      const repos = await reposResponse.json();

      data.github.user = {
        login: user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        created_at: user.created_at,
        public_repos: user.public_repos,
        followers: user.followers,
      };

      const simplePinned = GITHUB_PINNED.filter((p) => !p.includes("/"));
      const orgRepoPinned = GITHUB_PINNED.filter((p) => p.includes("/"));

      const pruneRepo = (repo) => ({
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        topics: repo.topics?.slice(0, 3) ?? [],
      });

      // Fetch external repos
      for (const fullName of orgRepoPinned) {
        try {
          const repoResponse = await fetch(
            `https://api.github.com/repos/${fullName}`,
          );
          if (repoResponse.ok) {
            data.github.pinned_repos.push(pruneRepo(await repoResponse.json()));
          }
        } catch (err) {
          console.warn(`Failed to fetch ${fullName}:`, err);
        }
      }

      // Process user repos
      for (const repo of repos) {
        if (simplePinned.includes(repo.name)) {
          data.github.pinned_repos.push(pruneRepo(repo));
        } else if (!repo.fork && !!repo.description) {
          data.github.repos.push(pruneRepo(repo));
        }
      }
    }
    console.log(
      `✓ GitHub: ${data.github.pinned_repos.length} pinned, ${data.github.repos.length} repos`,
    );
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
  }

  // Fetch YouTube data
  if (YOUTUBE_API_KEY) {
    try {
      const API_BASE = "https://www.googleapis.com/youtube/v3";
      const channelUrl =
        `${API_BASE}/channels?part=snippet,statistics,contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
      const channelResponse = await fetch(channelUrl);

      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        const channel = channelData.items?.[0];

        if (channel) {
          const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists
            ?.uploads;

          data.youtube.channel = {
            name: channel.snippet.title,
            description: channel.snippet.description?.split("\n")[0] ?? "",
            url: `https://www.youtube.com/@${YOUTUBE_HANDLE}`,
            avatar: channel.snippet.thumbnails?.medium?.url ||
              channel.snippet.thumbnails?.default?.url,
          };

          if (uploadsPlaylistId) {
            const videosUrl =
              `${API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=15&key=${YOUTUBE_API_KEY}`;
            const videosResponse = await fetch(videosUrl);

            if (videosResponse.ok) {
              const videosData = await videosResponse.json();
              data.youtube.videos = (videosData.items || []).map((item) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                published: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails?.maxres?.url ||
                  item.snippet.thumbnails?.high?.url ||
                  item.snippet.thumbnails?.medium?.url ||
                  `https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
              }));
            }
          }
        }
      }
      console.log(`✓ YouTube: ${data.youtube.videos.length} videos`);
    } catch (error) {
      console.error("Failed to fetch YouTube data:", error);
    }
  } else {
    console.log("⚠ YouTube: No API key configured");
  }

  // Fetch Saw That Band data
  if (SAWTHAT_USER_ID) {
    try {
      const response = await fetch(
        `https://server.sawthat.band/api/bands?id=${SAWTHAT_USER_ID}`,
      );
      if (response.ok) {
        const bands = await response.json();
        const bandNames = bands.map((b) => b.band);

        // Stage 1: Batch fetch Deezer artist IDs
        console.log("  Fetching artist IDs...");
        const artistIds = await batchFetchDeezerArtists(bandNames);
        const foundArtists = artistIds.filter((id) => id !== null).length;
        console.log(
          `  Found ${foundArtists}/${bandNames.length} artists on Deezer`,
        );

        // Stage 2: Batch fetch albums for all artists
        console.log("  Fetching albums...");
        const albumLists = await batchFetchDeezerAlbums(artistIds);

        // Stage 3: Find closest album for each concert
        console.log("  Matching albums to concerts...");
        const concertAlbums = []; // flat list of {bandIdx, concertIdx, artist, album, date}
        let matched = 0;

        bands.forEach((band, bandIdx) => {
          const albums = albumLists[bandIdx];
          band.concerts?.forEach((concert, concertIdx) => {
            const albumName = concert.date
              ? findClosestAlbum(albums, concert.date)
              : null;
            concertAlbums.push({
              bandIdx,
              concertIdx,
              artist: band.band,
              album: albumName,
              date: concert.date,
            });
            if (albumName) matched++;
          });
        });
        console.log(
          `  Matched ${matched}/${concertAlbums.length} concerts to albums`,
        );

        // Stage 4: Batch fetch album art for all concerts
        console.log("  Fetching artwork...");
        const artUrls = await batchFetchAlbumArt(
          concertAlbums.map(({ artist, album }) => ({ artist, album })),
        );

        // Stage 5: Batch extract colors for all concert artwork
        console.log("  Extracting colors...");
        const pictures = concertAlbums.map(({ bandIdx }, i) =>
          artUrls[i] || bands[bandIdx].picture
        );
        const colors = await Promise.all(pictures.map(extractColor));

        // Combine results - add album/picture/color to each concert
        const bandsWithConcertArt = bands.map((band, bandIdx) => ({
          id: band.id,
          band: band.band,
          picture: band.picture,
          concerts: band.concerts?.map((concert, concertIdx) => {
            const idx = concertAlbums.findIndex(
              (c) => c.bandIdx === bandIdx && c.concertIdx === concertIdx,
            );
            return {
              ...concert,
              album: concertAlbums[idx]?.album,
              picture: pictures[idx],
              color: colors[idx],
            };
          }) ?? [],
        }));

        data.sawthat.bands = bandsWithConcertArt;
      }
      console.log(`✓ SawThat: ${data.sawthat.bands.length} bands`);
    } catch (error) {
      console.error("Failed to fetch SawThat data:", error);
    }
  } else {
    console.log("⚠ SawThat: No user ID configured");
  }

  saveCache(data);
  return data;
}

const buildData = await fetchBuildData();

export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_DATE__: JSON.stringify(buildDate),
    __BUILD_DATA__: JSON.stringify(buildData),
  },
  plugins: [
    deno(),
    svelte({
      compilerOptions: {
        cssHash: ({ hash, css }) => `s${hash(css)}`, // shorter class names
      },
    }),
    Icons({
      compiler: "svelte",
    }),
  ],
  build: {
    target: "esnext", // no transpilation for modern browsers
    modulePreload: { polyfill: false }, // skip polyfill for modern browsers
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        // shorter chunk names
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]",
      },
      treeshake: {
        preset: "recommended",
        moduleSideEffects: false,
      },
    },
  },
  esbuild: {
    legalComments: "none", // strip license comments
    drop: ["console", "debugger"],
  },
  server: {
    proxy: {
      "/api/sawthat": {
        target: "https://server.sawthat.band",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sawthat/, "/api"),
      },
    },
  },
});
