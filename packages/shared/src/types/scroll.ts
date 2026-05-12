import React from 'react';
// src/types/scroll.ts

/**
 * Options for configuring scroll behavior in functions like enableSmoothScroll or scrollToTop.
 * Extends native ScrollIntoViewOptions for compatibility with browser APIs.
 */
export interface ScrollOptions extends globalThis.ScrollIntoViewOptions {
  /**
   * Threshold in pixels or percentage (0-1) for visibility checks or triggers.
   * If a number between 0 and 1, it's treated as a percentage of the viewport height.
   * @default 0
   */
  threshold?: number;
  /**
   * Optional callback to execute after scroll completes.
   */
  onScrollEnd?: () => void;
  /**
   * Duration of the scroll animation in milliseconds (if not using native 'smooth').
   * @default 300
   */
  duration?: number;
  /**
   * Easing function for custom animations (e.g., 'ease-in-out').
   * @default 'ease-in-out'
   */
  easing?: string;
}

/**
 * Props for a scroll progress indicator component, such as a reading progress bar.
 */
export interface ScrollProgressProps {
  /**
   * Background color of the progress bar.
   * Supports CSS color strings (e.g., '#007bff', 'rgb(0,123,255)', 'var(--primary)').
   * @default '#007bff' (blue)
   */
  color?: string;
  /**
   * Height of the progress bar in pixels or CSS units (e.g., '4px', '0.5rem').
   * @default '4px'
   */
  height?: string;
  /**
   * CSS z-index for layering.
   * @default 1000
   */
  zIndex?: number;
  /**
   * Position of the progress bar.
   * @default 'top'
   */
  position?: 'top' | 'bottom';
  /**
   * Target element to track progress for (e.g., document.body or a specific container).
   * @default window
   */
  target?: globalThis.Element | (typeof globalThis)['Window'];
  /**
   * Optional class name for additional styling.
   */
  className?: string;
}

/**
 * Props for a back-to-top button component.
 */
export interface BackToTopButtonProps {
  /**
   * Additional CSS classes for styling the button.
   */
  className?: string;
  /**
   * Scroll threshold (in pixels) before showing the button.
   * @default 300
   */
  threshold?: number;
  /**
   * Callback function when the button is clicked.
   * Defaults to scrolling to top smoothly.
   */
  onClick?: () => void;
  /**
   * Custom icon component or element for the button.
   * @default <ArrowUpIcon /> (assuming a default icon)
   */
  icon?: React.ReactNode;
  /**
   * Aria-label for accessibility.
   * @default 'Back to top'
   */
  'aria-label'?: string;
  /**
   * Button position on the screen.
   * @default 'bottom-right'
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /**
   * Scroll behavior when clicking the button.
   * @default 'smooth'
   */
  scrollBehavior?: 'auto' | 'smooth';
  /**
   * Transition duration for show/hide animation in milliseconds.
   * @default 200
   */
  transitionDuration?: number;
  /**
   * Optional tooltip text when hovering over the button.
   */
  tooltip?: string;
}
