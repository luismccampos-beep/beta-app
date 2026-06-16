import {
  FEATURES
} from "./chunk-TP5M5ICF.js";

// src/utils/date.ts
function toDateString(date) {
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 6e4);
  return normalized.toISOString().slice(0, 10);
}
function addDays(source, days) {
  const d = new Date(source);
  d.setDate(d.getDate() + days);
  return d;
}
function diffDays(start, end) {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1e3 * 60 * 60 * 24));
}

// src/utils/sanitize.ts
var controlChars = /[\u0000-\u001F\u007F]/g;
var whitespace = /\s+/g;
var sanitizeText = (value, options) => {
  const maxLength = options?.maxLength ?? 200;
  const trimmed = value.replace(controlChars, "").replace(whitespace, " ").trim();
  return trimmed.slice(0, maxLength);
};
var sanitizeHref = (value) => {
  if (!value) return void 0;
  const trimmed = value.replace(controlChars, "").trim();
  if (!trimmed) return void 0;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("?")) return trimmed;
  try {
    const url = new URL(trimmed, "https://akmleva.local");
    const protocol = url.protocol;
    const hostname = url.hostname.toLowerCase();
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
    if (protocol === "mailto:" || protocol === "tel:") return trimmed;
    if (protocol === "https:") return trimmed;
    if (protocol === "http:" && isLocal) return trimmed;
  } catch {
    return void 0;
  }
  return void 0;
};

// src/utils/rollout.ts
function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
  }
  return hash >>> 0;
}
function isFeatureEnabled(feature, userId) {
  const config = FEATURES[feature];
  if (!config) {
    return false;
  }
  if (!config.enabled) {
    return false;
  }
  if (!userId || userId.trim() === "") {
    return config.rollout >= 1;
  }
  const hash = hashCode(userId);
  const bucket = hash % 100;
  const rolloutPercentage = Math.floor(config.rollout * 100);
  return bucket < rolloutPercentage;
}
function getFeatureConfig(feature) {
  return FEATURES[feature] ?? null;
}

// src/utils/formatters.ts
var formatCurrency = (amount, currency = "EUR", locale = "pt-PT") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
};
var formatNumber = (value, locale = "pt-PT") => {
  return new Intl.NumberFormat(locale).format(value);
};
var formatPercentage = (value, decimals = 1, locale = "pt-PT") => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};
var formatDate = (date, locale = "pt-PT", options) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
};
var formatTime = (date, locale = "pt-PT") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(dateObj);
};
var formatDateTime = (date, locale = "pt-PT") => {
  return formatDate(date, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
var formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};
var formatFileSize = (bytes) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  if (i < 0 || i >= sizes.length) {
    return `${size.toFixed(1)} ?`;
  }
  return `${size.toFixed(1)} ${sizes[i]}`;
};
var truncateText = (text, maxLength, suffix = "...") => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};
var capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
var camelToTitle = (text) => {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
};
var formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phone;
};
var formatStatusBadge = (status, _type = "default") => {
  const statusMap = {
    // Newsletter statuses
    draft: { text: "Rascunho", className: "bg-gray-100 text-gray-800" },
    scheduled: { text: "Agendado", className: "bg-blue-100 text-blue-800" },
    sending: { text: "Enviando", className: "bg-yellow-100 text-yellow-800" },
    sent: { text: "Enviado", className: "bg-green-100 text-green-800" },
    failed: { text: "Falhou", className: "bg-red-100 text-red-800" },
    archived: { text: "Arquivado", className: "bg-gray-100 text-gray-800" },
    cancelled: { text: "Cancelado", className: "bg-red-100 text-red-800" },
    // Subscriber statuses
    active: { text: "Ativo", className: "bg-green-100 text-green-800" },
    pending: { text: "Pendente", className: "bg-yellow-100 text-yellow-800" },
    unsubscribed: { text: "Cancelado", className: "bg-red-100 text-red-800" },
    bounced: { text: "Rejeitado", className: "bg-red-100 text-red-800" },
    // Generic statuses
    enabled: { text: "Ativado", className: "bg-green-100 text-green-800" },
    disabled: { text: "Desativado", className: "bg-gray-100 text-gray-800" },
    online: { text: "Online", className: "bg-green-100 text-green-800" },
    offline: { text: "Offline", className: "bg-gray-100 text-gray-800" }
  };
  return statusMap[status.toLowerCase()] || {
    text: capitalize(status),
    className: "bg-gray-100 text-gray-800"
  };
};
var formatStatNumber = (value) => {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
};
var formatters = {
  currency: formatCurrency,
  number: formatNumber,
  percentage: formatPercentage,
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  duration: formatDuration,
  fileSize: formatFileSize,
  truncateText,
  capitalize,
  camelToTitle,
  phoneNumber: formatPhoneNumber,
  statusBadge: formatStatusBadge,
  statNumber: formatStatNumber
};

// src/utils/analytics.ts
function trackGtagEvent(action, category, label, value) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value
    });
  }
}

// src/utils/performance.ts
function debounce(func, wait) {
  let timeout = null;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
function requestAnimationFrameWrapper(callback) {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16);
}
function cancelAnimationFrameWrapper(id) {
  if (typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function createOptimizedScrollHandler(handler) {
  const throttledHandler = throttle((event) => {
    handler(event);
  }, 100);
  window.addEventListener("scroll", throttledHandler, { passive: true });
  return () => {
    window.removeEventListener("scroll", throttledHandler);
  };
}
function createOptimizedResizeHandler(handler) {
  const debouncedHandler = debounce((event) => {
    handler(event);
  }, 100);
  window.addEventListener("resize", debouncedHandler);
  return () => {
    window.removeEventListener("resize", debouncedHandler);
  };
}
function batchDOMUpdates(updates) {
  if (updates.length === 0) return;
  requestAnimationFrameWrapper(() => {
    updates.forEach((fn) => fn());
  });
}
function preloadResource(url, type = "image") {
  if (typeof document === "undefined") return;
  const link = document.createElement("link");
  link.rel = type === "image" ? "preload" : "prefetch";
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
}
function createLazyImageLoader() {
  if (typeof window === "undefined" || !window.IntersectionObserver) {
    return (img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
    };
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            obs.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01
    }
  );
  return (img) => {
    observer.observe(img);
  };
}
function optimizeAnimation(element, properties) {
  const originalStyles = {};
  const keys = Object.keys(properties);
  element.style.willChange = keys.join(",");
  keys.forEach((prop) => {
    const cssProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    originalStyles[cssProp] = element.style.getPropertyValue(cssProp);
    element.style.setProperty(cssProp, String(properties[prop]));
  });
  const cleanup = () => {
    element.style.willChange = "auto";
    keys.forEach((prop) => {
      const cssProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      element.style.removeProperty(cssProp);
    });
  };
  element.addEventListener("animationend", cleanup, { once: true });
  element.addEventListener("transitionend", cleanup, { once: true });
  return cleanup;
}
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function smoothScrollTo(element, offset = 0) {
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
function optimizedDebounce(func, wait, immediate = false) {
  let timeout = null;
  return (...args) => {
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (callNow) func(...args);
  };
}
var EventManager = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  addEventListener(element, event, listener, options) {
    const key = `${event}_${element.toString()}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, /* @__PURE__ */ new Set());
    }
    this.listeners.get(key).add(listener);
    element.addEventListener(event, listener, options);
  }
  removeAllListeners() {
    this.listeners.forEach((listeners) => {
      listeners.forEach((listener) => {
        listeners.delete(listener);
      });
    });
    this.listeners.clear();
  }
};

export {
  toDateString,
  addDays,
  diffDays,
  sanitizeText,
  sanitizeHref,
  isFeatureEnabled,
  getFeatureConfig,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatFileSize,
  truncateText,
  capitalize,
  camelToTitle,
  formatPhoneNumber,
  formatStatusBadge,
  formatStatNumber,
  formatters,
  trackGtagEvent,
  debounce,
  throttle,
  requestAnimationFrameWrapper,
  cancelAnimationFrameWrapper,
  prefersReducedMotion,
  createOptimizedScrollHandler,
  createOptimizedResizeHandler,
  batchDOMUpdates,
  preloadResource,
  createLazyImageLoader,
  optimizeAnimation,
  isInViewport,
  smoothScrollTo,
  optimizedDebounce,
  EventManager
};
//# sourceMappingURL=chunk-JRAFULD6.js.map