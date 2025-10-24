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
    value: "42",
    icon: "Code",
    color: "purple-500",
  },
  {
    title: "Entrepreneurship Events",
    value: "13",
    icon: "Entrepreneurship",
    color: "blue-500",
  },
  {
    title: "Overall Posts",
    value: "102",
    icon: "MessageSquare",
    color: "green-500",
  },
];

const container = document.getElementById("cards-container");

statsCards.forEach((stat) => {
  const card = document.createElement("div");
  card.className = "card-background";

  card.innerHTML = `
    <div class="card-img">
      <div class="card-img-insider bg-${stat.color}">
        ${icons[stat.icon] || "❔"}
      </div>
    </div>
    <div class="space-y-1">
      <p class="cards-number">${stat.value}</p>
      <p class="card-title">${stat.title}</p>
    </div>
  `;

  container.appendChild(card);
});
