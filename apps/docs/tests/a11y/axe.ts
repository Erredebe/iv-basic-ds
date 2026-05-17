import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

export async function waitForComponents(page: Page) {
  await page.waitForFunction(() => {
    const tags = ['iv-button', 'iv-dialog', 'iv-date-range-picker', 'iv-icon', 'iv-input', 'iv-textarea'];
    const presentTags = tags.filter(tag => document.querySelector(tag));

    return Promise.all(presentTags.map(tag => customElements.whenDefined(tag)));
  });
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(overflow.scrollWidth, `Expected no horizontal overflow: ${overflow.scrollWidth}px > ${overflow.viewportWidth}px`).toBeLessThanOrEqual(
    overflow.viewportWidth,
  );
}

export async function expectNoA11yViolations(page: Page, include?: string) {
  const results = await analyzeWithRetry(page, include);

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}

async function analyzeWithRetry(page: Page, include?: string) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const builder = new AxeBuilder({ page }).withTags(wcagTags);

      if (include) {
        builder.include(include);
      }

      return await builder.analyze();
    } catch (error) {
      if (!isAxeAlreadyRunningError(error) || attempt === 3) {
        throw error;
      }

      await page.waitForTimeout(500 * attempt);
    }
  }

  throw new Error('Axe analysis did not complete.');
}

function isAxeAlreadyRunningError(error: unknown) {
  return error instanceof Error && error.message.includes('Axe is already running');
}

function formatViolations(violations: Array<{ id: string; impact: string | null; help: string; nodes: Array<{ target: string[]; failureSummary?: string }> }>) {
  return violations
    .map(violation => {
      const nodes = violation.nodes
        .map(node => {
          const summary = node.failureSummary ? `: ${node.failureSummary}` : '';

          return `  - ${node.target.join(', ')}${summary}`;
        })
        .join('\n');

      return `${violation.id} (${violation.impact || 'unknown'}): ${violation.help}\n${nodes}`;
    })
    .join('\n\n');
}
