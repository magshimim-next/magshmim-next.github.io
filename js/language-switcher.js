/**
 * Language Switcher Component for Magshimim Next website
 * Provides UI for switching between English and Hebrew languages
 */

class LanguageSwitcher {
  constructor(i18nInstance) {
    this.i18n = i18nInstance;
    this.switcher = null;
    this.isAnimating = false;

    // Bind methods
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.toggleLanguage = this.toggleLanguage.bind(this);

    // Subscribe to language changes
    this.i18n.onLanguageChange(this.handleLanguageChange);
  }

  /**
   * Create the language switcher HTML structure
   * @returns {HTMLElement} Language switcher element
   */
  createSwitcher() {
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("role", "button");
    switcher.setAttribute("tabindex", "0");
    switcher.setAttribute("aria-label", "Switch Language");

    const currentLang = this.i18n.getCurrentLanguage();
    const isHebrew = currentLang === "he";
    // Only show the opposite language as the button
    switcher.innerHTML = `
      <div class="language-switcher-container">
        <div class="language-options">
           <span class="lang-option active" data-lang="${isHebrew ? "en" : "he"}">
            ${isHebrew ? "EN" : "עב"}
          </span>
        </div>
        <div class="language-switcher-indicator">
          <svg class="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
      </div>
    `;

    // Add event listeners
    switcher.addEventListener("click", this.toggleLanguage);
    switcher.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleLanguage();
      }
    });

    // Add click event for the single visible option
    const langOption = switcher.querySelector(".lang-option");
    langOption.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetLang = langOption.dataset.lang;
      if (targetLang !== this.i18n.getCurrentLanguage()) {
        this.switchToLanguage(targetLang);
      }
    });

    this.switcher = switcher;
    return switcher;
  }

  /**
   * Add CSS styles for the language switcher
   */
  addStyles() {
    const styleId = "language-switcher-styles";
    if (document.getElementById(styleId)) {
      return; // Styles already added
    }

    const styles = document.createElement("style");
    styles.id = styleId;
    styles.textContent = `
      .language-switcher {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 6px 10px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;
        user-select: none;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .language-switcher:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-1px) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .language-switcher:focus {
        outline: 2px solid #7eccff;
        outline-offset: 2px;
      }

      .language-switcher-container {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .language-options {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 700;
        font-family: 'Inter', Arial, sans-serif;
      }

      .lang-option {
        padding: 2px 6px;
        border-radius: 4px;
        transition: all 0.2s ease;
        cursor: pointer;
        opacity: 0.6;
        color: white;
      }

      .lang-option.active {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
        color: #7eccff;
        font-weight: 700;
      }

      .lang-option:hover:not(.active) {
        opacity: 0.8;
        background: rgba(255, 255, 255, 0.1);
      }

      .lang-divider {
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        font-weight: 300;
      }

      .language-switcher-indicator {
        display: flex;
        align-items: center;
      }

      .globe-icon {
        width: 14px;
        height: 14px;
        color: rgba(255, 255, 255, 0.9);
        transition: transform 0.3s ease;
      }

      .language-switcher:hover .globe-icon {
        transform: rotate(15deg);
        color: #7eccff;
      }

      .language-switcher.switching .globe-icon {
        animation: switchRotate 0.6s ease-in-out;
      }

      @keyframes switchRotate {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg); }
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .language-switcher {
          padding: 4px 8px;
        }

        .language-options {
          font-size: 11px;
          gap: 3px;
        }

        .lang-option {
          padding: 1px 3px;
        }

        .globe-icon {
          width: 12px;
          height: 12px;
        }
      }

      /* RTL adjustments */
      [dir="rtl"] .language-switcher-container {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .language-options {
        flex-direction: row-reverse;
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Initialize the language switcher and add it to the DOM
   * @param {HTMLElement|string} container - Container element or selector
   */
  init(container = ".top-bar .actions") {
    this.addStyles();

    const containerElement =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    if (!containerElement) {
      console.error("Language switcher container not found:", container);
      return;
    }

    const switcher = this.createSwitcher();

    // Insert before the first child (or as first child if no children)
    if (containerElement.firstChild) {
      containerElement.insertBefore(switcher, containerElement.firstChild);
    } else {
      containerElement.appendChild(switcher);
    }
  }

  /**
   * Toggle between English and Hebrew
   */
  async toggleLanguage() {
    if (this.isAnimating) return;

    const currentLang = this.i18n.getCurrentLanguage();
    const targetLang = currentLang === "en" ? "he" : "en";

    await this.switchToLanguage(targetLang);
  }

  /**
   * Switch to a specific language
   * @param {string} targetLang - Target language code
   */
  async switchToLanguage(targetLang) {
    if (this.isAnimating || targetLang === this.i18n.getCurrentLanguage()) {
      return;
    }

    this.isAnimating = true;

    // Add switching animation class
    if (this.switcher) {
      this.switcher.classList.add("switching");
    }

    try {
      // Switch language
      await this.i18n.changeLanguage(targetLang);

      // Update visual indicators
      this.updateVisualState();
    } catch (error) {
      console.error("Error switching language:", error);
    } finally {
      // Remove animation class and reset state
      setTimeout(() => {
        if (this.switcher) {
          this.switcher.classList.remove("switching");
        }
        this.isAnimating = false;
      }, 600);
    }
  }

  /**
   * Update visual state of the switcher
   */
  updateVisualState() {
    // Only update the label and data attribute, do not recreate DOM
    if (!this.switcher) return;
    const currentLang = this.i18n.getCurrentLanguage();
    const isHebrew = currentLang === "he";
    const langOption = this.switcher.querySelector(".lang-option");
    if (langOption) {
      langOption.textContent = isHebrew ? "EN" : "עב";
      langOption.setAttribute("data-lang", isHebrew ? "en" : "he");
    }
  }

  /**
   * Handle language change events from i18n system
   * @param {string} newLanguage - New language code
   */
  handleLanguageChange(newLanguage) {
    this.updateVisualState();
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    if (this.switcher) {
      this.switcher.removeEventListener("click", this.toggleLanguage);
      this.switcher.remove();
      this.switcher = null;
    }

    this.i18n.offLanguageChange(this.handleLanguageChange);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Wait for i18n to be ready
  if (window.i18n) {
    await window.i18n.init();

    // Create and initialize language switcher
    const switcher = new LanguageSwitcher(window.i18n);
    switcher.init();

    // Make switcher globally available
    window.languageSwitcher = switcher;
  }
});

export default LanguageSwitcher;
