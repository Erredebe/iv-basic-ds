import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export async function waitForComponents(page: Page) {
  await page.waitForFunction(() =>
    Promise.all([
      customElements.whenDefined('iv-button').catch(() => undefined),
      customElements.whenDefined('iv-dialog').catch(() => undefined),
      customElements.whenDefined('iv-icon').catch(() => undefined),
      customElements.whenDefined('iv-input').catch(() => undefined),
      customElements.whenDefined('iv-textarea').catch(() => undefined),
    ]),
  );
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
  const builder = new AxeBuilder({ page }).withTags(wcagTags);

  if (include) {
    builder.include(include);
  }

  const results = await builder.analyze();

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
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
