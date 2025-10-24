// Testimonials data
const testimonials = [
  {
    name: "Magshimist Madhim",
    role: "Magshim Halomot",
    company: "MagshiCorp",
    avatar: "MM",
    content:
      "Magshimim Next transformed my career. The mentorship program connected me with amazing developers, and I landed my dream job within 6 months!",
    achievement: "Got promoted to Senior Magshimist",
  },
  {
    name: "Marcus Rodriguez",
    role: "AI/ML Engineer",
    company: "DataVision",
    avatar: "MR",
    content:
      "The AI workshops here are incredible. I went from zero ML knowledge to building production models. The community support is unmatched!",
    achievement: "Built 3 ML models in production",
  },
  {
    name: "Priya Patel",
    role: "Startup Founder",
    company: "EcoTech Solutions",
    avatar: "PP",
    content:
      "Found my co-founder through Magshimim Next! Our startup raised $2M seed funding. This community is a goldmine for connections and opportunities.",
    achievement: "Raised $2M in seed funding",
  },
  {
    name: "Alex Kim",
    role: "Open Source Maintainer",
    company: "Various Projects",
    avatar: "AK",
    content:
      "The collaborative projects here helped me become a better developer. Now I maintain 3 popular open source libraries with 10K+ stars!",
    achievement: "10K+ GitHub stars on projects",
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

// Create a single testimonial card
function createTestimonialCard(testimonial) {
  return `
    <div class="testimonial-card">
      
      <div class="testimonial-header">
        <div class="avatar">${testimonial.avatar}</div>
        <div class="testimonial-info">
          <h4 class="testimonial-name">${testimonial.name}</h4>
          <p class="testimonial-role">${testimonial.role}</p>
          <p class="testimonial-company">${testimonial.company}</p>
        </div>
      </div>

      <p class="testimonial-content">
        "${testimonial.content}"
      </p>

      <div class="testimonial-achievement">
        ${awardSVG}
        <span>${testimonial.achievement}</span>
      </div>
    </div>
  `;
}

// Create carousel HTML
function createCarousel() {
  const cardsHTML = testimonials.map((t) => createTestimonialCard(t)).join("");
  const dotsHTML = testimonials
    .map(
      (_, i) =>
        `<span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>`
    )
    .join("");

  return `
    <div class="carousel-wrapper">
      <button class="carousel-btn carousel-prev" id="prevBtn">
        ${prevArrowSVG}
      </button>
      
      <div class="carousel-container">
        <div class="carousel-track" id="carouselTrack">
          ${cardsHTML}
        </div>
      </div>
      
      <button class="carousel-btn carousel-next" id="nextBtn">
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
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateCarousel();
  }

  function goToPrev() {
    currentIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length;
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

  // Auto-advance carousel every 5 seconds
  setInterval(goToNext, 10000);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("testimonials-container");
  if (container) {
    container.innerHTML = createCarousel();
    initCarousel();
  }
});
