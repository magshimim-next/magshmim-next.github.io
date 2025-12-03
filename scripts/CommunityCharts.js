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

loadJsonFile(jsonFilePath).then((data) => {
  if (data) {
    LoadCharts(data);
  } else {
    console.log("Failed to load JSON data.");
  }
});

async function LoadCharts(statistics) {
  const ctx = document.getElementById("myChart");
  const data = statistics["data"];
  console.log("Statistics:", data);
  const processedLabels = data.map((row) => {
    let label = Array.isArray(row.label) ? row.label.join(" ") : row.label;
    // Split long labels into 2 lines at space (roughly around 15 chars)
    if (label.length > 15) {
      const words = label.split(" ");
      const mid = Math.ceil(words.length / 2);
      label = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
    }
    return label;
  });

  // Detect mobile for responsive label handling
  const isMobile = window.innerWidth <= 768;
  const labelFontSize = isMobile ? 9 : 12;

  const graph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: processedLabels,
      datasets: [
        {
          label: "Percentage of community members",
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
              family: "Inter, Arial, sans-serif",
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
              family: "Inter, Arial, sans-serif",
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
            family: "Inter, Arial, sans-serif",
          },
          bodyFont: {
            size: 13,
            family: "Inter, Arial, sans-serif",
          },
          cornerRadius: 8,
        },
      },
    },
  });
}
