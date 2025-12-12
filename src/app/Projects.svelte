<script lang="ts">
  import { githubState } from "../lib/github.svelte";
  import { fade } from "svelte/transition";
  import IconPin from "~icons/carbon/pin-filled";
  import IconStar from "~icons/carbon/star-filled";
  import IconFork from "~icons/carbon/branch";
  import IconRepo from "~icons/carbon/catalog";
  import IconFollowers from "~icons/carbon/group";
  import IconCalendar from "~icons/carbon/calendar";
  import IconCode from "~icons/carbon/code";
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
  <h2 class="section-heading"><IconCode width="52" height="52" /> Open Source Projects</h2>
</div>

<div class="projects-container">
  {#if githubState.error}
    <div class="error">{githubState.error}</div>
  {:else}
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

    <a
      href={githubState.user?.html_url ?? `https://github.com/${githubState.username}`}
      target="_blank"
      rel="noopener noreferrer"
      class="profile-section"
    >
      <div class="profile-header">
        {#if githubState.user?.avatar_url}
          <img
            src={githubState.user.avatar_url}
            alt={githubState.username}
            class="profile-avatar"
          />
        {/if}
        <span class="profile-username">@{githubState.username}</span>
      </div>
      {#if aggregateStats().yearsOnGitHub != null}
        <div class="profile-stat">
          <IconCalendar class="stat-icon calendar" />
          <span class="stat-value">{aggregateStats().yearsOnGitHub}</span>
          <span class="stat-label">years</span>
        </div>
      {/if}
      <div class="profile-stat">
        <IconFollowers class="stat-icon followers" />
        <span class="stat-value">{aggregateStats().followers.toLocaleString()}</span>
        <span class="stat-label">followers</span>
      </div>
      <div class="profile-stat">
        <IconStar class="stat-icon star" />
        <span class="stat-value">{aggregateStats().totalStars.toLocaleString()}</span>
        <span class="stat-label">stargazers</span>
      </div>
      <div class="profile-stat">
        <IconFork class="stat-icon fork" />
        <span class="stat-value">{aggregateStats().totalForks.toLocaleString()}</span>
        <span class="stat-label">forkers</span>
      </div>
      <div class="profile-stat">
        <IconRepo class="stat-icon repo" />
        <span class="stat-value">{aggregateStats().publicRepos.toLocaleString()}</span>
        <span class="stat-label">repos</span>
      </div>
    </a>

    {#if languageStats().length > 0}
      {@const total = languageStats().reduce((sum, s) => sum + s.count, 0)}
      {@const radius = 70}
      {@const labelRadius = 115}
      <div class="languages-section">
        <svg class="donut-chart" viewBox="0 0 200 200">
          {#each languageStats() as stat, i}
            {@const startAngle = languageStats().slice(0, i).reduce((sum, s) => sum + s.count, 0) / total * 360}
            {@const sweepAngle = (stat.count / total) * 360}
            {@const midAngle = (startAngle + sweepAngle / 2 - 90) * (Math.PI / 180)}
            {@const largeArc = sweepAngle > 180 ? 1 : 0}
            {@const startRad = (startAngle - 90) * (Math.PI / 180)}
            {@const endRad = (startAngle + sweepAngle - 90) * (Math.PI / 180)}
            {@const x1 = 100 + radius * Math.cos(startRad)}
            {@const y1 = 100 + radius * Math.sin(startRad)}
            {@const x2 = 100 + radius * Math.cos(endRad)}
            {@const y2 = 100 + radius * Math.sin(endRad)}
            {@const labelX = 100 + labelRadius * Math.cos(midAngle)}
            {@const labelY = 100 + labelRadius * Math.sin(midAngle)}
            <path
              d="M {x1} {y1} A {radius} {radius} 0 {largeArc} 1 {x2} {y2}"
              fill="none"
              stroke={stat.color}
              stroke-width="28"
            />
            <text
              x={labelX}
              y={labelY - 5}
              text-anchor="middle"
              dominant-baseline="middle"
              class="donut-label"
            >
              {stat.language}
            </text>
            <text
              x={labelX}
              y={labelY + 5}
              text-anchor="middle"
              dominant-baseline="middle"
              class="donut-label donut-label-percent"
            >
              {Math.round((stat.count / total) * 100)}%
            </text>
          {/each}
        </svg>
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "@carbon/colors";

  .projects-header {
    padding: 2rem 2rem 2rem 2rem;
    text-align: center;
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
      var(--cds-background),
      transparent
    );
  }

  .marquee-wrapper::after {
    right: 0;
    background: linear-gradient(
      to left in oklab,
      var(--cds-background),
      transparent
    );
  }

  .error,
  .empty {
    text-align: center;
    padding: 2rem;
    color: var(--cds-text-helper);
    font-size: 1rem;
  }

  .error {
    color: var(--cds-support-error);
  }

  .profile-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem 1.5rem;
    padding: 2rem 2rem 1rem;
    text-decoration: none;
    color: inherit;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .profile-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--cds-border-subtle-01);
  }

  .profile-username {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--cds-text-primary);
  }

  .profile-stat {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.2s ease;
  }

  .profile-stat :global(.stat-icon) {
    width: 18px;
    height: 18px;
  }

  .profile-stat :global(.stat-icon.star) {
    color: var(--cds-support-warning);
  }

  .profile-stat :global(.stat-icon.fork) {
    color: #{colors.$cyan-40};
  }

  .profile-stat :global(.stat-icon.repo) {
    color: #{colors.$purple-50};
  }

  .profile-stat :global(.stat-icon.followers) {
    color: var(--cds-support-success);
  }

  .profile-stat :global(.stat-icon.calendar) {
    color: var(--cds-support-info);
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--cds-text-primary);
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--cds-text-helper);
  }

  .languages-section {
    display: flex;
    justify-content: center;
    padding: 5rem 2rem 6rem;
  }

  .donut-chart {
    width: 400px;
    height: 400px;
    overflow: visible;
  }

  .donut-label {
    font-size: 8px;
    fill: var(--cds-text-helper);
  }

  .donut-label-percent {
    font-size: 6px;
    fill: var(--cds-text-placeholder);
  }

  .marquee-wrapper {
    overflow: hidden;
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
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
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    border-radius: 8px;
    padding: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    text-decoration: none;
    color: var(--cds-text-on-color);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
  }

  .project-card:hover {
    transform: translateY(-4px);
    background: var(--cds-layer-hover-01);
    border-color: var(--cds-border-strong-01);
    box-shadow: var(--cds-shadow);
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
    color: var(--cds-text-primary);
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
    color: var(--cds-icon-secondary);
    position: relative;
    top: -2px;
  }

  .project-description {
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--cds-text-helper);
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
    color: var(--cds-text-helper);
    flex-shrink: 0;
  }

  .language {
    font-weight: 500;
    color: var(--cds-text-helper);
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
    background: var(--cds-layer-accent-01);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.7rem;
    color: var(--cds-text-helper);
    border: 1px solid var(--cds-border-subtle-01);
  }

  .pinned-card {
    background: var(--cds-layer-accent-01);
    border-color: var(--cds-border-subtle-01);
  }

  .pinned-card:hover {
    transform: translateY(-4px);
    background: var(--cds-layer-accent-hover-01);
    border-color: var(--cds-border-strong-01);
    box-shadow: var(--cds-shadow);
  }
</style>
