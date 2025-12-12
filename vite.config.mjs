import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import deno from "@deno/vite-plugin";
import Icons from "unplugin-icons/vite";
import { execSync } from "node:child_process";
import { Jimp } from "jimp";

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

function linearToSrgb(c) {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
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

function oklabToRgb(L, a, b) {
  const l = L + 0.3963377774 * a + 0.2158037573 * b;
  const m = L - 0.1055613458 * a - 0.0638541728 * b;
  const s = L - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l * l * l;
  const m3 = m * m * m;
  const s3 = s * s * s;

  const lr = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  return {
    r: Math.round(linearToSrgb(lr) * 255),
    g: Math.round(linearToSrgb(lg) * 255),
    b: Math.round(linearToSrgb(lb) * 255),
  };
}

async function extractColor(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const image = await Jimp.read(Buffer.from(buffer));
    image.resize({ w: 50, h: 50 });

    let sumL = 0, sumA = 0, sumB = 0;
    let pixelCount = 0;
    const { width, height } = image;

    // Define center exclusion zone (middle 66%)
    const marginX = Math.floor(width / 6);
    const marginY = Math.floor(height / 6);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Skip center region
        if (
          x >= marginX && x < width - marginX &&
          y >= marginY && y < height - marginY
        ) {
          continue;
        }

        const pixel = image.getPixelColor(x, y);
        const r = (pixel >> 24) & 0xff;
        const g = (pixel >> 16) & 0xff;
        const b = (pixel >> 8) & 0xff;

        const oklab = rgbToOklab(r, g, b);
        sumL += oklab.L;
        sumA += oklab.a;
        sumB += oklab.b;
        pixelCount++;
      }
    }

    const avgL = sumL / pixelCount;
    const avgA = sumA / pixelCount;
    const avgB = sumB / pixelCount;

    const rgb = oklabToRgb(avgL, avgA, avgB);
    return { bg: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, isLight: avgL > 0.6 };
  } catch (err) {
    console.warn(`Failed to extract color from ${imageUrl}:`, err.message);
    return null;
  }
}

// Fetch and prune all dynamic content
async function fetchBuildData() {
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

        // Extract colors in parallel
        const bandsWithColors = await Promise.all(
          bands.map(async (band) => {
            const color = await extractColor(band.picture);
            return {
              id: band.id,
              band: band.band,
              picture: band.picture,
              concerts: band.concerts,
              color,
            };
          }),
        );

        data.sawthat.bands = bandsWithColors;
      }
      console.log(`✓ SawThat: ${data.sawthat.bands.length} bands`);
    } catch (error) {
      console.error("Failed to fetch SawThat data:", error);
    }
  } else {
    console.log("⚠ SawThat: No user ID configured");
  }

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
