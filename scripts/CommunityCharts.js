async function loadJsonFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error loading JSON file:", error);
    return null;
  }
}

const jsonFilePath = "scripts/statistics.json";

// Store the statistics data for re-rendering
let statisticsData = null;
let isI18nReady = false;
let isLanguageListenerSetup = false;

// Helper: Wait for i18n to be ready
async function waitForI18nReady() {
  let attempts = 0;
  const maxAttempts = 30;
  while (
    (!window.i18n || typeof window.i18n.init !== "function") &&
    attempts < maxAttempts
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  if (!window.i18n) return false;
  await window.i18n.init();
  isI18nReady = true;
  return true;
}

// Helper: Wait for statistics data
async function waitForStatisticsData() {
  if (statisticsData) return statisticsData;
  statisticsData = await loadJsonFile(jsonFilePath);
  return statisticsData;
}

// Render chart only after both i18n and data are ready
async function renderChartsWhenReady() {
  await waitForI18nReady();
  await waitForStatisticsData();
  if (statisticsData && isI18nReady) {
    LoadCharts(statisticsData);
    if (window.i18n) window.i18n.translateStaticContent();
  }
}

// Initialize charts and i18n together
async function initChartsAndI18n() {
  await renderChartsWhenReady();
  setupLanguageListener();
}

// Re-render charts and update static content (for language changes)
async function renderCharts() {
  await renderChartsWhenReady();
}

// Setup language change listener (only once)
function setupLanguageListener() {
  if (!isLanguageListenerSetup && window.i18n) {
    window.i18n.onLanguageChange(async () => {
      isI18nReady = false;
      await waitForI18nReady();
      renderCharts();
    });
    isLanguageListenerSetup = true;
  }
}

// Start initialization

// Wait for i18n to be available with proper cleanup
async function waitForI18n() {
  // Wait for window.i18n to be available
  let attempts = 0;
  const maxAttempts = 20;
  while (!window.i18n && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  if (!window.i18n) return;
  await window.i18n.init();
  isI18nReady = true;
  setupLanguageListener();
  if (statisticsData) {
    renderCharts();
  }
}

// Start initialization (single robust entrypoint)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initChartsAndI18n();
  });
} else {
  initChartsAndI18n();
}
// Global chart instance for cleanup
let chartInstance = null;

async function LoadCharts(statistics) {
  const ctx = document.getElementById("myChart");
  if (!ctx) return;

  // Destroy existing chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const data = statistics["data"];
  // Only log once during development, not on every render
  // console.log("Statistics:", data);

  // Process labels with translation, handle arrays for multi-line labels
  const processedLabels = data.map((row) => {
    let label = row.label || row.labelKey || "";
    if (window.i18n && row.labelKey) {
      let translated = window.i18n.translate(row.labelKey);
      if (translated && translated !== row.labelKey) {
        label = translated;
      }
    }
    // If translation is an array, use as-is (for multi-line labels)
    if (Array.isArray(label)) {
      return label;
    }
    // If translation is a string, split into two lines if long
    if (typeof label === "string" && label.length > 15) {
      const words = label.split(" ");
      const mid = Math.ceil(words.length / 2);
      label = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
    }
    return label;
  });

  // Get translated dataset label, fallback to readable if translation is missing
  let datasetLabel = "Percentage of community members";
  if (window.i18n) {
    let translated = window.i18n.translate("charts.dataset_label");
    if (
      translated &&
      translated !== "charts.dataset_label" &&
      !translated.startsWith("charts.")
    ) {
      datasetLabel = translated;
    }
  }

  // Detect mobile for responsive label handling
  const isMobile = window.innerWidth <= 768;
  const labelFontSize = isMobile ? 9 : 12;

  // Determine font family based on current language
  const isRTL = window.i18n && window.i18n.isCurrentLanguageRTL();
  const fontFamily = isRTL
    ? "Noto Sans Hebrew, David, Arial, sans-serif"
    : "Inter, Arial, sans-serif";

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: processedLabels,
      datasets: [
        {
          label: datasetLabel,
          data: data.map((row) => row.count),
          backgroundColor: data.map((row) => row.background || "#7eccffff"),
          borderColor: data.map((row) => row.borderColor || "#95d6f0d8"),
          borderWidth: 2,
          borderRadius: 12,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: "easeInOutCubic",
      },
      scales: {
        x: {
          type: "category",
          ticks: {
            font: {
              size: labelFontSize,
              family: fontFamily,
              weight: "600",
            },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            padding: 5,
            color: "#457b9d",
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
            font: {
              size: 12,
              family: fontFamily,
            },
            color: "#457b9d",
          },
          grid: {
            color: "rgba(69, 123, 157, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(11, 72, 112, 0.9)",
          padding: 12,
          titleFont: {
            size: 14,
            family: fontFamily,
          },
          bodyFont: {
            size: 13,
            family: fontFamily,
          },
          cornerRadius: 8,
          // Keep tooltip content in current language, always use translated label
          callbacks: {
            label: function (context) {
              let label = context.dataset.label;
              // If label is a translation key, try to translate
              if (window.i18n && label && label.startsWith("charts.")) {
                let translated = window.i18n.translate(label);
                if (
                  translated &&
                  translated !== label &&
                  !translated.startsWith("charts.")
                ) {
                  label = translated;
                }
              }
              return `${label}: ${context.parsed.y}%`;
            },
          },
        },
      },
    },
  });
}
