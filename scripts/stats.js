// Replace with actual icons or use emojis or SVGs for now
const icons = {
  Users: "👥",
  Code: "💻",
  MessageSquare: "💬",
  Entrepreneurship: "🚀",
};

const statsCards = [
  {
    title: "Total Members",
    value: "1980",
    icon: "Users",
    color: "blue-500",
  },
  {
    title: "Tech Events",
    value: "542",
    icon: "Code",
    color: "purple-500",
  },
  {
    title: "Entrepreneurship Events",
    value: "67",
    icon: "Entrepreneurship",
    color: "blue-500",
  },
  {
    title: "Overall Posts",
    value: "2,156",
    icon: "MessageSquare",
    color: "green-500",
  },
];

const container = document.getElementById("cards-container");

statsCards.forEach((stat) => {
  const card = document.createElement("div");
  card.className =
    "p-6 bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300";

  card.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="p-3 rounded-lg bg-${stat.color}/20 text-${
    stat.color
  } text-xl">
        ${icons[stat.icon] || "❔"}
      </div>
    </div>
    <div class="space-y-1">
      <p class="text-2xl font-bold text-gray-800">${stat.value}</p>
      <p class="text-sm text-gray-500">${stat.title}</p>
    </div>
  `;

  container.appendChild(card);
});
