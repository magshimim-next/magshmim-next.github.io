/**
 * Internationalization (i18n) utility for Magshimim Next website
 * Supports dynamic language switching between English and Hebrew with RTL layout
 */

class I18n {
  constructor() {
    this.currentLanguage = "he";
    this.fallbackLanguage = "he";
    this.translations = {};
    this.isRTL = false;
    this.observers = [];

    // Initialize language from localStorage or browser preference
    this.initializeLanguage();

    // Bind methods to preserve context
    this.translate = this.translate.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  /**
   * Initialize language from localStorage or browser preference
   */
  initializeLanguage() {
    const savedLanguage = localStorage.getItem("magshimim-next-language");
    if (savedLanguage && ["en", "he"].includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith("he")) {
        this.currentLanguage = "he";
      }
    }

    this.isRTL = this.currentLanguage === "he";
  }

  /**
   * Load translation file for a specific language
   * @param {string} language - Language code (en/he)
   * @returns {Promise<Object>} Translation data
   */
  async loadTranslation(language) {
    if (this.translations[language]) {
      return this.translations[language];
    }

    try {
      const response = await fetch(`translations/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translation: ${response.status}`);
      }

      const data = await response.json();
      this.translations[language] = data;
      return data;
    } catch (error) {
      console.error(`Error loading translation for ${language}:`, error);

      // If Hebrew fails, try to load English as fallback
      if (language !== this.fallbackLanguage) {
        return this.loadTranslation(this.fallbackLanguage);
      }

      return {};
    }
  }

  /**
   * Get translation value by nested key path
   * @param {string} keyPath - Dot-separated key path (e.g., 'stats.total_members')
   * @param {Object} params - Parameters for interpolation
   * @returns {string} Translated text
   */
  translate(keyPath, params = {}) {
    const keys = keyPath.split(".");
    let value = this.translations[this.currentLanguage];

    // Navigate through nested object structure
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        // Fallback to English translation
        let fallbackValue = this.translations[this.fallbackLanguage];
        for (const fallbackKey of keys) {
          if (
            fallbackValue &&
            typeof fallbackValue === "object" &&
            fallbackKey in fallbackValue
          ) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            fallbackValue = null;
            break;
          }
        }
        value = fallbackValue || keyPath; // Return key path if no translation found
        break;
      }
    }

    // Return array values as-is (for chart labels that can be multi-line)
    if (Array.isArray(value)) {
      return value;
    }

    // Convert value to string for interpolation
    if (typeof value !== "string") {
      return keyPath;
    }

    // Parameter interpolation
    return this.interpolate(value, params);
  }

  /**
   * Interpolate parameters into translation string
   * @param {string} template - Template string with {{param}} placeholders
   * @param {Object} params - Parameters to interpolate
   * @returns {string} Interpolated string
   */
  interpolate(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params.hasOwnProperty(key) ? params[key] : match;
    });
  }

  /**
   * Change current language and notify observers
   * @param {string} language - New language code (en/he)
   * @returns {Promise<void>}
   */
  async changeLanguage(language) {
    if (!["en", "he"].includes(language) || language === this.currentLanguage) {
      return;
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;
    this.isRTL = language === "he";

    // Save language preference
    localStorage.setItem("magshimim-next-language", language);

    // Load translation data
    await this.loadTranslation(language);

    // Update document language and direction
    this.updateDocumentAttributes();

    // Translate static content with new language
    this.translateStaticContent();

    // Notify observers about language change
    this.notifyObservers(oldLanguage, language);
  }

  /**
   * Update document language and direction attributes
   */
  updateDocumentAttributes() {
    const html = document.documentElement;
    html.lang = this.currentLanguage;
    html.dir = this.isRTL ? "rtl" : "ltr";

    // Toggle RTL CSS
    const rtlStylesheet = document.getElementById("rtl-styles");
    if (rtlStylesheet) {
      rtlStylesheet.disabled = !this.isRTL;
    }
  }

  /**
   * Subscribe to language change events
   * @param {Function} callback - Callback function to execute on language change
   */
  onLanguageChange(callback) {
    this.observers.push(callback);
  }

  /**
   * Unsubscribe from language change events
   * @param {Function} callback - Callback function to remove
   */
  offLanguageChange(callback) {
    this.observers = this.observers.filter((obs) => obs !== callback);
  }

  /**
   * Notify all observers about language change
   * @param {string} oldLanguage - Previous language code
   * @param {string} newLanguage - New language code
   */
  notifyObservers(oldLanguage, newLanguage) {
    this.observers.forEach((callback) => {
      try {
        callback(newLanguage, oldLanguage);
      } catch (error) {
        console.error("Error in language change observer:", error);
      }
    });
  }

  /**
   * Initialize i18n system - load initial translation and update DOM
   * @returns {Promise<void>}
   */
  async init() {
    await this.loadTranslation(this.currentLanguage);

    // Also preload the other language for faster switching
    const otherLang = this.currentLanguage === "en" ? "he" : "en";
    this.loadTranslation(otherLang).catch(() => {}); // Silent fail for preloading

    this.updateDocumentAttributes();
    this.translateStaticContent();
  }

  /**
   * Translate static content in the DOM with data-i18n attributes
   */
  translateStaticContent() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key) {
        const translation = this.translate(key);

        if (
          element.tagName.toLowerCase() === "input" &&
          element.type === "submit"
        ) {
          element.value = translation;
        } else if (element.hasAttribute("placeholder")) {
          element.placeholder = translation;
        } else if (element.hasAttribute("alt")) {
          element.alt = translation;
        } else if (element.hasAttribute("title")) {
          element.title = translation;
        } else if (element.hasAttribute("aria-label")) {
          element.setAttribute("aria-label", translation);
        } else {
          // Handle HTML content (for links with nested tags)
          if (typeof translation === "string" && translation.includes("<a")) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      }
    });
  }

  /**
   * Get current language code
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if current language is RTL
   * @returns {boolean} True if RTL language
   */
  isCurrentLanguageRTL() {
    return this.isRTL;
  }

  /**
   * Format activity string with proper pluralization
   * @param {number} years - Number of years
   * @param {number} months - Number of months
   * @returns {string} Formatted activity string
   */
  formatActivityDuration(years, months) {
    let parts = [];

    if (years > 0) {
      const yearKey = years === 1 ? "stats.year" : "stats.years";
      parts.push(`${years} ${this.translate(yearKey)}`);
    }

    if (months > 0) {
      const monthKey = months === 1 ? "stats.month" : "stats.months";
      parts.push(`${months} ${this.translate(monthKey)}`);
    }

    if (parts.length === 0) {
      return this.translate("stats.less_than_month");
    }

    return parts.join(" ");
  }
}

// Create global instance
const i18n = new I18n();

// Export for use in other modules
window.i18n = i18n;

export default i18n;
