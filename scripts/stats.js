// Replace with actual icons or use emojis or SVGs for now
const icons = {
  Users: "👥",
  events: "🎙️",
  MessageSquare: "💬",
  Rocket: "🚀",
};

// Calculate activity duration
function calculateActivityDuration() {
  const startDate = new Date(2022, 11);
  const now = new Date();
  let months =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());
  if (now.getDate() < startDate.getDate()) months--;
  months += 1;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  // Use i18n for proper pluralization
  if (window.i18n) {
    return window.i18n.formatActivityDuration(years, remMonths);
  } else {
    // Fallback for when i18n is not loaded yet
    let activityString = "";
    if (years > 0) activityString += `${years} Year${years > 1 ? "s" : ""}`;
    if (remMonths > 0)
      activityString += `${activityString ? " " : ""}${remMonths} Month${remMonths > 1 ? "s" : ""}`;
    if (!activityString) activityString = "<1 Month";
    return activityString;
  }
}

// Stats cards configuration with translation keys
const statsCardsConfig = [
  {
    titleKey: "stats.total_members",
    value: "4012",
    icon: "Users",
    color: "blue-500",
  },
  {
    titleKey: "stats.community_events",
    value: "46",
    icon: "events",
    color: "purple-500",
  },
  {
    titleKey: "stats.community_forums", // Fixed typo from "Formus"
    value: "15",
    icon: "MessageSquare",
    color: "blue-500",
  },
  {
    titleKey: "stats.years_of_activity",
    value: calculateActivityDuration,
    icon: "Rocket",
    color: "green-500",
  },
];

function renderStatsCards() {
  const container = document.getElementById("cards-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  let needsRerender = false;
  statsCardsConfig.forEach((statConfig) => {
    const card = document.createElement("div");
    card.className = "card-background";

    // Get value (could be a function for dynamic values)
    let value =
      typeof statConfig.value === "function"
        ? statConfig.value()
        : statConfig.value;
    // If value contains untranslated keys, mark for rerender
    if (
      typeof value === "string" &&
      (value.includes("stats.year") || value.includes("stats.month"))
    ) {
      needsRerender = true;
    }

    card.innerHTML = `
      <div class="card-img">
        <div class="card-img-insider bg-${statConfig.color}">
          ${icons[statConfig.icon] || "❔"}
        </div>
      </div>
      <div class="space-y-1">
        <p class="cards-number">${value}</p>
        <p class="card-title" data-i18n="${statConfig.titleKey}"></p>
      </div>
    `;

    container.appendChild(card);
  });
  // After all cards are rendered, translate them
  if (window.i18n && typeof window.i18n.translateStaticContent === "function") {
    window.i18n.translateStaticContent();
  }
  // If any card had untranslated keys, schedule a rerender
  if (needsRerender) {
    setTimeout(renderStatsCards, 200);
  }
}

// Track if language listener is already set up
let isStatsLanguageListenerSetup = false;

// Setup language change listener (only once)
function setupStatsLanguageListener() {
  if (!isStatsLanguageListenerSetup && window.i18n) {
    window.i18n.onLanguageChange(() => {
      renderStatsCards();
    });
    isStatsLanguageListenerSetup = true;
  }
}

// Initialize stats cards
function initStatsCards() {
  renderStatsCards();
  setupStatsLanguageListener();
}

// Wait for i18n to be available with proper cleanup
function waitForI18nStats() {
  if (window.i18n) {
    initStatsCards();
  } else {
    // Fallback: check a few times with increasing delays, then give up
    let attempts = 0;
    const maxAttempts = 10;
    const checkI18n = () => {
      attempts++;
      if (window.i18n) {
        initStatsCards();
      } else if (attempts < maxAttempts) {
        setTimeout(checkI18n, 200 * attempts); // Increasing delay: 200ms, 400ms, 600ms, etc.
      }
    };

    checkI18n();
  }
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForI18nStats);
} else {
  waitForI18nStats();
}
