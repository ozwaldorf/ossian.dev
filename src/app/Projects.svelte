<script lang="ts">
  import { githubState } from "../lib/github.svelte";
  import { fade } from "svelte/transition";
  import IconPin from "~icons/carbon/pin-filled";
  import IconStar from "~icons/carbon/star-filled";
  import IconFork from "~icons/carbon/branch";
  import IconRepo from "~icons/carbon/catalog";
  import IconFollowers from "~icons/carbon/group";
  import IconCalendar from "~icons/carbon/calendar";
  import * as colors from "@carbon/colors";

  const languageColors: Record<string, string> = {
    TypeScript: colors.blue50,
    JavaScript: colors.yellow30,
    Python: colors.purple50,
    Rust: colors.red50,
    Go: colors.cyan40,
    Java: colors.orange40,
    "C++": colors.magenta50,
    C: colors.gray50,
    "C#": colors.purple50,
    Ruby: colors.red50,
    PHP: colors.purple50,
    Swift: colors.orange40,
    Kotlin: colors.purple50,
    Scala: colors.red50,
    Shell: colors.green40,
    HTML: colors.orange40,
    CSS: colors.purple50,
    SCSS: colors.magenta50,
    Vue: colors.teal40,
    Svelte: colors.orange40,
    Nix: colors.blue30,
  };

  function getLanguageColor(language: string | null): string {
    if (!language) return colors.gray50;
    return languageColors[language] ?? colors.gray50;
  }

  // Adjust scroll speed based on number of items (5s per card)
  let scrollDuration = $derived(githubState.repos.length * 5);
  let displayRepos = $derived(
    githubState.repos.length > 0
      ? [...githubState.repos, ...githubState.repos]
      : [],
  );

  let pinnedScrollDuration = $derived(githubState.pinned_repos.length * 8 * 3);
  let displayPinnedRepos = $derived(
    githubState.pinned_repos.length > 0
      ? [
          ...githubState.pinned_repos,
          ...githubState.pinned_repos,
          ...githubState.pinned_repos,
        ]
      : [],
  );

  // Calculate language stats from all repos (pinned + regular)
  let languageStats = $derived(() => {
    const allRepos = [...githubState.pinned_repos, ...githubState.repos];
    const counts: Record<string, number> = {};
    for (const repo of allRepos) {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([language, count]) => ({
        language,
        count,
        color: getLanguageColor(language),
      }))
      .sort((a, b) => b.count - a.count);
  });

  // Calculate aggregate stats
  let aggregateStats = $derived(() => {
    const allRepos = [...githubState.pinned_repos, ...githubState.repos];
    const totalStars = allRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );
    const totalForks = allRepos.reduce(
      (sum, repo) => sum + repo.forks_count,
      0,
    );
    const yearsOnGitHub = githubState.user?.created_at
      ? Math.floor(
          (Date.now() - new Date(githubState.user.created_at).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25),
        )
      : null;
    return {
      totalStars,
      totalForks,
      publicRepos: githubState.user?.public_repos ?? 0,
      followers: githubState.user?.followers ?? 0,
      yearsOnGitHub,
    };
  });
</script>

<div class="projects-header">
  <h2>Open Source Projects</h2>
</div>

<div class="projects-container">
  {#if githubState.error}
    <div class="error">{githubState.error}</div>
  {:else}
    <div class="github-stats">
      {#if aggregateStats().yearsOnGitHub != null}
        <a
          href={githubState.user?.html_url ??
            `https://github.com/${githubState.username}`}
          target="_blank"
          rel="noopener noreferrer"
          class="stat-item"
        >
          <IconCalendar class="stat-icon calendar" />
          <span class="stat-value">{aggregateStats().yearsOnGitHub}</span>
          <span class="stat-label">years on GitHub</span>
        </a>
      {/if}
      <a
        href={`https://github.com/${githubState.username}?tab=followers`}
        target="_blank"
        rel="noopener noreferrer"
        class="stat-item"
      >
        <IconFollowers class="stat-icon followers" />
        <span class="stat-value"
          >{aggregateStats().followers.toLocaleString()}</span
        >
        <span class="stat-label">followers</span>
      </a>
      <a
        href={githubState.user?.html_url ??
          `https://github.com/${githubState.username}`}
        target="_blank"
        rel="noopener noreferrer"
        class="stat-item"
      >
        <IconStar class="stat-icon star" />
        <span class="stat-value"
          >{aggregateStats().totalStars.toLocaleString()}</span
        >
        <span class="stat-label">stargazers</span>
      </a>
      <a
        href={githubState.user?.html_url ??
          `https://github.com/${githubState.username}`}
        target="_blank"
        rel="noopener noreferrer"
        class="stat-item"
      >
        <IconFork class="stat-icon fork" />
        <span class="stat-value"
          >{aggregateStats().totalForks.toLocaleString()}</span
        >
        <span class="stat-label">forkers</span>
      </a>
      <a
        href={`https://github.com/${githubState.username}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        class="stat-item"
      >
        <IconRepo class="stat-icon repo" />
        <span class="stat-value"
          >{aggregateStats().publicRepos.toLocaleString()}</span
        >
        <span class="stat-label">repos</span>
      </a>
    </div>

    {#if languageStats().length > 0}
      <div class="language-legend">
        {#each languageStats() as stat}
          <div class="legend-item">
            <span class="legend-dot" style="background-color: {stat.color};"
            ></span>
            <span class="legend-name">{stat.language}</span>
            <span class="legend-count">({stat.count})</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if displayPinnedRepos.length > 0}
      <div class="marquee-wrapper">
        <div
          class="marquee marquee-reverse"
          style="animation-duration: {pinnedScrollDuration}s;"
        >
          {#each displayPinnedRepos as repo (repo.id + Math.random())}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="project-card pinned-card"
              style="border-color: {getLanguageColor(repo.language)};"
            >
              {#key repo.name}
                <div class="card-content" in:fade>
                  <div class="card-header">
                    <h3 class="project-name">
                      {repo.name}
                      <IconPin class="pin-icon" />
                    </h3>
                    <div class="project-meta">
                      {#if repo.language}
                        <span class="language">{repo.language}</span>
                      {/if}
                      <span class="stars"
                        ><IconStar style="color: {colors.yellow30}" />
                        {repo.stargazers_count}</span
                      >
                    </div>
                  </div>
                  {#if repo.description}
                    <p class="project-description">{repo.description}</p>
                  {/if}
                  {#if repo.topics && repo.topics.length > 0}
                    <div class="topics">
                      {#each repo.topics.slice(0, 3) as topic}
                        <span class="topic">{topic}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/key}
            </a>
          {/each}
        </div>
      </div>
    {/if}

    {#if displayRepos.length > 0}
      <div class="marquee-wrapper">
        <div class="marquee" style="animation-duration: {scrollDuration}s;">
          {#each displayRepos as repo (repo.id + Math.random())}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              class="project-card"
              style="border-color: {getLanguageColor(repo.language)};"
            >
              {#key repo.name}
                <div class="card-content" in:fade>
                  <div class="card-header">
                    <h3 class="project-name">{repo.name}</h3>
                    <div class="project-meta">
                      {#if repo.language}
                        <span class="language">{repo.language}</span>
                      {/if}
                      <span class="stars"
                        ><IconStar style="color: {colors.yellow30}" />
                        {repo.stargazers_count}</span
                      >
                    </div>
                  </div>
                  {#if repo.description}
                    <p class="project-description">{repo.description}</p>
                  {/if}
                  {#if repo.topics && repo.topics.length > 0}
                    <div class="topics">
                      {#each repo.topics.slice(0, 3) as topic}
                        <span class="topic">{topic}</span>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/key}
            </a>
          {/each}
        </div>
      </div>
    {:else if displayPinnedRepos.length === 0}
      <div class="empty">No projects found</div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "@carbon/colors";

  .projects-header {
    padding: 2rem 2rem 2rem 2rem;
    text-align: center;
  }

  .projects-header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: color-mix(in oklab, #{colors.$gray-10} 90%, transparent);
  }

  .projects-container {
    overflow: hidden;
    position: relative;
  }

  .marquee-wrapper::before,
  .marquee-wrapper::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: min(200px, 15vw);
    z-index: 2;
    pointer-events: none;
  }

  .marquee-wrapper::before {
    left: 0;
    background: linear-gradient(
      to right in oklab,
      #{colors.$gray-100},
      transparent
    );
  }

  .marquee-wrapper::after {
    right: 0;
    background: linear-gradient(
      to left in oklab,
      #{colors.$gray-100},
      transparent
    );
  }

  .error,
  .empty {
    text-align: center;
    padding: 2rem;
    color: #{colors.$gray-60};
    font-size: 1rem;
  }

  .error {
    color: #{colors.$red-50};
  }

  .github-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 0 2rem 1.5rem;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #{colors.$gray-30};
    transition: color 0.2s ease;
  }

  .stat-item:hover {
    color: #{colors.$gray-10};
  }

  .stat-item :global(.stat-icon) {
    width: 18px;
    height: 18px;
    color: #{colors.$gray-50};
    transition: color 0.2s ease;
  }

  .stat-item:hover :global(.stat-icon.star) {
    color: #{colors.$yellow-30};
  }

  .stat-item:hover :global(.stat-icon.fork) {
    color: #{colors.$cyan-40};
  }

  .stat-item:hover :global(.stat-icon.repo) {
    color: #{colors.$purple-50};
  }

  .stat-item:hover :global(.stat-icon.followers) {
    color: #{colors.$green-40};
  }

  .stat-item:hover :global(.stat-icon.calendar) {
    color: #{colors.$blue-50};
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #{colors.$gray-50};
  }

  .language-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 0 2rem 1.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-name {
    font-size: 0.8rem;
    color: #{colors.$gray-40};
  }

  .legend-count {
    font-size: 0.75rem;
    color: #{colors.$gray-50};
    font-variant-numeric: tabular-nums;
  }

  .marquee-wrapper {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .marquee {
    display: flex;
    gap: 1rem;
    animation: scroll linear infinite;
    width: max-content;
    padding: 0.5rem 0;
  }

  .marquee:hover {
    animation-play-state: paused;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .marquee-reverse {
    animation-name: scroll-reverse;
  }

  @keyframes scroll-reverse {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0%);
    }
  }

  .project-card {
    flex-shrink: 0;
    width: 280px;
    min-height: 160px;
    background: color-mix(in oklab, #{colors.$white} 3%, transparent);
    border: 1px solid color-mix(in oklab, #{colors.$white} 8%, transparent);
    border-radius: 8px;
    padding: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    text-decoration: none;
    color: #{colors.$white};
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
  }

  .project-card:hover {
    transform: translateY(-4px);
    background: color-mix(in oklab, #{colors.$white} 6%, transparent);
    border-color: color-mix(in oklab, #{colors.$white} 20%, transparent);
    box-shadow: 0 8px 32px
      color-mix(in oklab, #{colors.$black} 30%, transparent);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .project-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #{colors.$gray-10};
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .project-name :global(.pin-icon) {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: #{colors.$gray-50};
    position: relative;
    top: -2px;
  }

  .project-description {
    font-size: 0.85rem;
    line-height: 1.4;
    color: #{colors.$gray-50};
    margin: 0;
    flex-grow: 1;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: #{colors.$gray-40};
    flex-shrink: 0;
  }

  .language {
    font-weight: 500;
    color: #{colors.$gray-50};
  }

  .stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-variant-numeric: tabular-nums;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .topic {
    background: color-mix(in oklab, #{colors.$white} 6%, transparent);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.7rem;
    color: #{colors.$gray-50};
    border: 1px solid color-mix(in oklab, #{colors.$white} 5%, transparent);
  }

  .pinned-card {
    background: color-mix(in oklab, #{colors.$white} 5%, transparent);
    border-color: color-mix(in oklab, #{colors.$white} 12%, transparent);
  }

  .pinned-card:hover {
    background: color-mix(in oklab, #{colors.$white} 8%, transparent);
    border-color: color-mix(in oklab, #{colors.$white} 25%, transparent);
  }
</style>
