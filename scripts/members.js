// Members data with translation keys
const members = [
  {
    name: "Shay Shwartz", // Fallback for alt text
    nameKey: "members.names.shay_shwartz",
    roleKey: "Co-Founder & CEO",
    company: "Stealth",
    image: "assets/images/members/shay-shwartz.jpg",
    achievementKey: "members.achievements.forbes_30_under_30",
  },
  {
    name: "Oran Moyal", // Fallback for alt text
    nameKey: "members.names.oran_moyal",
    roleKey: "Co-Founder & CTO",
    company: "Stealth",
    image: "assets/images/members/oran-moyal.jpg",
    achievementKey: "members.achievements.forbes_30_under_30",
  },
  {
    name: "Ariel Litmanovitch", // Fallback for alt text
    nameKey: "members.names.ariel_litmanovitch",
    roleKey: "Co-Founder & CTO",
    company: "Aryon Security",
    image: "assets/images/members/ariel-litmanovitch.jpg",
    achievementKey: "members.achievements.forbes_30_under_30",
  },
  {
    name: "Lior Pozin", // Fallback for alt text
    nameKey: "members.names.lior_pozin",
    roleKey: "Co-Founder & CEO",
    company: "AutoDS",
    acquiredBy: "Fiverr",
    image: "assets/images/members/lior-pozin.jpg",
    achievementKey: "members.achievements.forbes_30_under_30",
  },
  {
    name: "Daniel Drizin", // Fallback for alt text
    nameKey: "members.names.daniel_drizin",
    roleKey: "VP R&D",
    company: "Paragon",
    image: "assets/images/members/daniel-drizin.jpg",
  },
  {
    name: "Yahav Ohana", // Fallback for alt text
    nameKey: "members.names.yahav_ohana",
    roleKey: "Co-Founder & CTO",
    company: "Assant",
    acquiredBy: "JFrog",
    image: "assets/images/members/yahav-ohana.jpg",
  },
];

// SVG Icons as strings
const awardSVG = `
  <svg class="achievement-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
`;

function getArrowSVGs() {
  const isRTL = document.documentElement.dir === "rtl";
  // In RTL, swap the arrows so they point visually correct
  return {
    prev: isRTL
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    next: isRTL
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  };
}

const briefcaseSVG = `
  <svg class="briefcase-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
`;

// Create a single member card
function createMemberCard(member) {
  // Get translated name and role, fallback to readable name if translation missing
  let name = member.name;
  let role = member.role || member.roleKey;
  let achievement = member.achievementKey;
  if (window.i18n) {
    const translatedName = window.i18n.translate(member.nameKey);
    const translatedRole = window.i18n.translate(member.roleKey);
    const translatedAchievement = member.achievementKey
      ? window.i18n.translate(member.achievementKey)
      : null;
    // If translation returns the key itself or is falsy, fallback to readable
    name =
      translatedName &&
      !translatedName.startsWith("members.names.") &&
      translatedName !== member.nameKey
        ? translatedName
        : member.name;
    role =
      translatedRole &&
      !translatedRole.startsWith("members.roles.") &&
      translatedRole !== member.roleKey
        ? translatedRole
        : member.role || member.roleKey;
    if (member.achievementKey) {
      achievement =
        translatedAchievement &&
        !translatedAchievement.startsWith("members.achievements.") &&
        translatedAchievement !== member.achievementKey
          ? translatedAchievement
          : "";
    }
  }

  // Get achievement section if exists
  const achievement_section = achievement
    ? `<div class="member-achievement">
          ${awardSVG}
          <span>${achievement}</span>
        </div>`
    : ``;

  // Handle company display with "Acquired by" if applicable
  let companyDisplay = member.company;
  if (member.acquiredBy) {
    const acquiredText = window.i18n
      ? window.i18n.translate("members.acquired_by")
      : "Acquired by";
    companyDisplay = `${member.company} (${acquiredText} ${member.acquiredBy})`;
  }

  return `
    <div class="member-card">
      <div class="member-card-content">
        <div class="member-avatar-wrapper" style="background: linear-gradient(135deg, #0b4870, #457b9d)">
          <img src="${member.image}" alt="${member.name}" class="member-avatar-img" />
        </div>

        <div class="member-info">
          <h3 class="member-name">${name}</h3>
          <div class="member-role-container">
            ${briefcaseSVG}
            <p class="member-role">${role}</p>
          </div>
          <p class="member-company">${companyDisplay}</p>
        </div>

        ${achievement_section}
      </div>
    </div>
  `;
}

// Create carousel HTML
function createCarousel() {
  const cardsHTML = members.map((m) => createMemberCard(m)).join("");
  const dotsHTML = members
    .map(
      (_, i) =>
        `<span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>`,
    )
    .join("");

  // Get translated aria-labels
  const prevLabel = window.i18n
    ? window.i18n.translate("members.aria_previous")
    : "Previous member";
  const nextLabel = window.i18n
    ? window.i18n.translate("members.aria_next")
    : "Next member";

  const arrows = getArrowSVGs();
  return `
    <div class="carousel-wrapper">
      <button class="carousel-btn carousel-prev" id="prevBtn" aria-label="${prevLabel}">
        ${arrows.prev}
      </button>

      <div class="carousel-container">
        <div class="carousel-track" id="carouselTrack">
          ${cardsHTML}
        </div>
      </div>

      <button class="carousel-btn carousel-next" id="nextBtn" aria-label="${nextLabel}">
        ${arrows.next}
      </button>
    </div>

    <div class="carousel-dots" id="carouselDots">
      ${dotsHTML}
    </div>
  `;
}

// Initialize carousel functionality
function initCarousel() {
  let currentIndex = 0;
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dots = document.querySelectorAll(".dot");

  if (!track || !prevBtn || !nextBtn) return;

  // Detect RTL
  const isRTL = document.documentElement.dir === "rtl";

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToNext() {
    if (isRTL) {
      currentIndex = (currentIndex - 1 + members.length) % members.length;
    } else {
      currentIndex = (currentIndex + 1) % members.length;
    }
    updateCarousel();
  }

  function goToPrev() {
    if (isRTL) {
      currentIndex = (currentIndex + 1) % members.length;
    } else {
      currentIndex = (currentIndex - 1 + members.length) % members.length;
    }
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  nextBtn.addEventListener("click", goToNext);
  prevBtn.addEventListener("click", goToPrev);

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      goToSlide(index);
    });
  });

  // Auto-advance carousel every 8 seconds
  setInterval(goToNext, 8000);
}

// Render members carousel
function renderMembersCarousel() {
  const container = document.getElementById("members-container");
  if (!container) return;

  container.innerHTML = createCarousel();
  initCarousel();
}

// Initialize members carousel
function initMembersCarousel() {
  renderMembersCarousel();

  // Listen for language changes to re-render and reset carousel
  if (window.i18n) {
    window.i18n.onLanguageChange(() => {
      // Always reset to first slide on language change
      renderMembersCarousel();
    });
  }
}

// Wait for i18n to be available and initialized before rendering carousel
async function waitForI18nAndInitCarousel() {
  function ready() {
    return window.i18n && typeof window.i18n.init === "function";
  }
  if (!ready()) {
    let attempts = 0;
    const maxAttempts = 20;
    const check = () => {
      attempts++;
      if (ready()) {
        window.i18n.init().then(initMembersCarousel);
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100 * attempts);
      }
    };
    check();
  } else {
    window.i18n.init().then(initMembersCarousel);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForI18nAndInitCarousel);
} else {
  waitForI18nAndInitCarousel();
}
