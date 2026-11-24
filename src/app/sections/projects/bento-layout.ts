import { Project } from '../../data/portfolio.models';

/** Width of a card in the 3-column bento grid (large screens). */
export type CardSpan = 1 | 2 | 3;

export interface BentoItem {
  readonly project: Project;
  readonly span: CardSpan;
}

const COLUMNS = 3;
/** How many featured projects get a large (2-column) card. */
const LARGE_FEATURED = 2;

/**
 * Turns an ordered project list into a bento layout where every row is full.
 *
 * 1. The first two featured projects are "large" (span 2); everything else spans 1.
 * 2. Cards are placed in order into rows of 3 columns.
 * 3. If the next card doesn't fit in the current row, the last card in that row is
 *    widened to fill the gap, so no row ever has an empty hole.
 *
 * Pure function (no Angular), so it works for any filter result and is easy to test.
 * Example, all six projects: [3] / [2, 1] / [1, 1, 1].
 */
export function bentoLayout(projects: readonly Project[]): BentoItem[] {
  const items: { project: Project; span: CardSpan }[] = [];
  let featuredSeen = 0;
  let rowUsed = 0;

  for (const project of projects) {
    const isLarge = project.featured && featuredSeen++ < LARGE_FEATURED;
    const span: CardSpan = isLarge ? 2 : 1;

    if (rowUsed + span > COLUMNS) {
      widenLast(items, COLUMNS - rowUsed);
      rowUsed = 0;
    }
    items.push({ project, span });
    rowUsed = (rowUsed + span) % COLUMNS;
  }

  // Close the final row too.
  if (rowUsed > 0) widenLast(items, COLUMNS - rowUsed);
  return items;
}

function widenLast(items: { span: CardSpan }[], extra: number): void {
  const last = items.at(-1);
  if (last && extra > 0) last.span = Math.min(COLUMNS, last.span + extra) as CardSpan;
}
