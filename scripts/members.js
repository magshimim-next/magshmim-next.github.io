// Members data
const members = [
  {
    name: "Shay Shwartz",
    role: "Co-Founder & CEO",
    company: "Stealth",
    image: "assets/images/members/shay-shwartz.jpg",
    achievement: "Featured in Forbes 30 Under 30",
  },
  {
    name: "Oran Moyal",
    role: "Co-Founder & CTO",
    company: "Stealth",
    image: "assets/images/members/oran-moyal.jpg",
    achievement: "Featuren in Forbes 30 Under 30",
  },
  {
    name: "Ariel Litmanovitch",
    role: "Co-Founder & CTO",
    company: "Aryon Security",
    image: "assets/images/members/ariel-litmanovitch.jpg",
    achievement: "Featured in Forbes 30 Under 30",
  },
  {
    name: "Yair Ladizhensky",
    role: "Co-Founder & CPO",
    company: "Aryon Security",
    image: "assets/images/members/yair-ladizhensky.jpg",
    achievement: "Featured in Forbes 30 Under 30",
  },
  {
    name: "Lior Pozin",
    role: "Co-Founder & CEO",
    company: "AutoDS (Acquired by Fiverr)",
    image: "assets/images/members/lior-pozin.jpg",
    achievement: "Featured in Forbes 30 Under 30",
  },
  {
    name: "Daniel Drizin",
    role: "VP R&D",
    company: "Paragon",
    image: "assets/images/members/daniel-drizin.jpg",
  },
  {
    name: "Sharon Shmueli",
    role: "CTO",
    company: "Team8 Capital",
    image: "assets/images/members/sharon-shmueli.jpg",
  },
  {
    name: "Yahav Ohana",
    role: "Co-Founder & CTO",
    company: "Assant (Acquired by JFrog)",
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

const prevArrowSVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
`;

const nextArrowSVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
`;

const briefcaseSVG = `
  <svg class="briefcase-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
`;

// Create a single member card
function createMemberCard(member) {
  const achievement_section = member.achievement
    ? `<div class="member-achievement">
          ${awardSVG}
          <span>${member.achievement}</span>
        </div>`
    : ``;
  return `
    <div class="member-card">
      <div class="member-card-content">
        <div class="member-avatar-wrapper" style="background: linear-gradient(135deg, #0b4870, #457b9d)">
          <img src="${member.image}" alt="${member.name}" class="member-avatar-img" />
        </div>
        
        <div class="member-info">
          <h3 class="member-name">${member.name}</h3>
          <div class="member-role-container">
            ${briefcaseSVG}
            <p class="member-role">${member.role}</p>
          </div>
          <p class="member-company">${member.company}</p>
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
        `<span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>`
    )
    .join("");

  return `
    <div class="carousel-wrapper">
      <button class="carousel-btn carousel-prev" id="prevBtn" aria-label="Previous member">
        ${prevArrowSVG}
      </button>
      
      <div class="carousel-container">
        <div class="carousel-track" id="carouselTrack">
          ${cardsHTML}
        </div>
      </div>
      
      <button class="carousel-btn carousel-next" id="nextBtn" aria-label="Next member">
        ${nextArrowSVG}
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

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % members.length;
    updateCarousel();
  }

  function goToPrev() {
    currentIndex = (currentIndex - 1 + members.length) % members.length;
    updateCarousel();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // Event listeners
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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("members-container");
  if (container) {
    container.innerHTML = createCarousel();
    initCarousel();
  }
});
