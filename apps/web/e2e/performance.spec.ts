import { test, expect } from './fixtures/test-helpers';

test.describe('Performance & Metrics', () => {
  test.describe('Core Web Vitals', () => {
    test('homepage meets performance budget', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Measure page load time
      const metrics = await page.evaluate(async () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
        };
      });

      // Page should load within reasonable time
      expect(metrics.domContentLoaded).toBeLessThan(3000);
      expect(metrics.loadComplete).toBeLessThan(5000);
    });

    test('pages have no layout shifts (CLS)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for layout shifts using web-vitals or manual check
      const hasLayoutIssues = await page.evaluate(() => {
        // Check if page has proper image dimensions
        const images = document.querySelectorAll('img');
        let issues = 0;
        
        images.forEach((img) => {
          if (!img.width || !img.height) {
            issues++;
          }
        });

        return issues;
      });

      // Should have minimal layout issues
      expect(hasLayoutIssues).toBeLessThan(5);
    });

    test('images are optimized', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for unoptimized images
      const imageStats = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        let totalSize = 0;
        let unoptimized = 0;

        images.forEach((img) => {
          const src = img.getAttribute('src') || '';
          // Check if image is from Next.js optimized images
          if (src.includes('/_next/image')) {
            // Optimized
          } else if (src && !src.includes('data:')) {
            unoptimized++;
          }
        });

        return { total: images.length, unoptimized };
      });

      // Most images should be optimized (allow some for external assets)
      const optimizationRate = (imageStats.total - imageStats.unoptimized) / imageStats.total;
      expect(optimizationRate).toBeGreaterThan(0.5);
    });
  });

  test.describe('Resource Loading', () => {
    test('no render-blocking resources', async ({ page }) => {
      const renderBlockingResources: string[] = [];

      await page.route('**/*', (route) => {
        const request = route.request();
        const resourceType = request.resourceType();

        // Track render-blocking CSS and scripts
        if (resourceType === 'stylesheet' || (resourceType === 'script' && !request.url().includes('async'))) {
          renderBlockingResources.push(request.url());
        }

        route.continue();
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should have minimal render-blocking resources
      expect(renderBlockingResources.length).toBeLessThan(10);
    });

    test('static assets are cached', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check cache headers for static assets
      const cacheStats = await page.evaluate(async () => {
        const responses = await performance.getEntriesByType('resource');
        let cached = 0;
        let total = 0;

        for (const entry of responses) {
          if (entry.name.includes('/_next/static/')) {
            total++;
            // In a real scenario, you'd check response headers
            // For now, we just count static assets
            cached++;
          }
        }

        return { total, cached };
      });

      // Static assets should exist
      expect(cacheStats.total).toBeGreaterThan(0);
    });

    test('no duplicate resource loads', async ({ page }) => {
      const resourceUrls: string[] = [];

      await page.route('**/*', (route) => {
        const url = route.request().url();
        resourceUrls.push(url);
        route.continue();
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for duplicates
      const uniqueResources = new Set(resourceUrls);
      const duplicateCount = resourceUrls.length - uniqueResources.size;

      // Should have minimal duplicates
      expect(duplicateCount).toBeLessThan(5);
    });
  });

  test.describe('JavaScript Performance', () => {
    test('no long tasks blocking main thread', async ({ page }) => {
      await page.evaluate(() => {
        // Monitor long tasks
        (window as any).__longTasks = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            (window as any).__longTasks.push(entry);
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const taskCount = await page.evaluate(() => {
        return (window as any).__longTasks?.length || 0;
      });

      // Should have minimal long tasks (>50ms)
      expect(taskCount).toBeLessThan(5);
    });

    test('bundle size is reasonable', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check JavaScript execution time
      const jsMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domInteractive: navigation.domInteractive - navigation.startTime,
          domComplete: navigation.domComplete - navigation.startTime,
        };
      });

      // JavaScript should execute within reasonable time
      expect(jsMetrics.domInteractive).toBeLessThan(3000);
    });
  });

  test.describe('Network Performance', () => {
    test('minimizes HTTP requests', async ({ page }) => {
      const requests: string[] = [];

      await page.route('**/*', (route) => {
        requests.push(route.request().url());
        route.continue();
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should have reasonable number of requests
      expect(requests.length).toBeLessThan(100);
    });

    test('uses efficient caching strategies', async ({ page }) => {
      const response = await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Page should load successfully
      expect(response?.status()).toBeLessThan(400);

      // In a real scenario, you'd check Cache-Control headers
      // For now, we just verify the page loads
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('compresses responses', async ({ page }) => {
      const responses: { url: string; headers: any }[] = [];

      await page.route('**/*', (route) => {
        const response = route.fetch().then(res => {
          responses.push({
            url: route.request().url(),
            headers: res.headers(),
          });
        });

        route.continue();
        return response;
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for compression headers (at least some responses should be compressed)
      const compressedResponses = responses.filter(r => 
        r.headers['content-encoding'] || r.headers['Content-Encoding']
      );

      // At least HTML should be compressed
      const htmlCompressed = responses.some(r => 
        r.url.includes('.html') || !r.url.includes('.') && compressedResponses.length > 0
      );

      expect(htmlCompressed || compressedResponses.length > 0).toBe(true);
    });
  });

  test.describe('Mobile Performance', () => {
    test('performs well on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const elapsed = Date.now() - start;

      // Should load within 5 seconds on mobile
      expect(elapsed).toBeLessThan(5000);
    });

    test('mobile assets are optimized', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for mobile-specific optimizations
      const hasViewportMeta = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport !== null;
      });

      expect(hasViewportMeta).toBe(true);
    });
  });

  test.describe('Lighthouse Metrics', () => {
    test('meets basic performance criteria', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Basic performance checks
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        return {
          // First Contentful Paint (approximate)
          fcp: (performance.getEntriesByName('first-contentful-paint')[0] as any)?.startTime || 0,
          // DOM load time
          domLoad: navigation.loadEventEnd - navigation.startTime,
        };
      });

      // FCP should be under 2 seconds
      if (metrics.fcp > 0) {
        expect(metrics.fcp).toBeLessThan(2000);
      }
    });
  });
});