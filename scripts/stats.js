// Replace with actual icons or use emojis or SVGs for now
const icons = {
  Users: "👥",
  events: "🎙️",
  MessageSquare: "💬",
  Rocket: "🚀",
};

const startDate = new Date(2022, 11);
const now = new Date();
let months =
  (now.getFullYear() - startDate.getFullYear()) * 12 +
  (now.getMonth() - startDate.getMonth());
if (now.getDate() < startDate.getDate()) months--;
months += 1;
const years = Math.floor(months / 12);
const remMonths = months % 12;
let activityString = "";
if (years > 0) activityString += `${years} Year${years > 1 ? "s" : ""}`;
if (remMonths > 0)
  activityString += `${activityString ? " " : ""}${remMonths} Month${remMonths > 1 ? "s" : ""}`;
if (!activityString) activityString = "<1 Month";

const statsCards = [
  {
    title: "Total Members",
    value: "4012",
    icon: "Users",
    color: "blue-500",
  },
  {
    title: "Community Events",
    value: "46",
    icon: "events",
    color: "purple-500",
  },
  {
    title: "Community Formus",
    value: "15",
    icon: "MessageSquare",
    color: "blue-500",
  },
  {
    title: "Years of Activity",
    value: activityString,
    icon: "Rocket",
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
