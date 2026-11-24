import { makeProject } from '../../../testing/portfolio.fixture';
import { bentoLayout } from './bento-layout';

const featured = (id: string) => makeProject({ id, featured: true });
const plain = (id: string) => makeProject({ id });
const spans = (ids: ReturnType<typeof makeProject>[]) => bentoLayout(ids).map((i) => i.span);

describe('bentoLayout', () => {
  it('lays out the full list as [3] / [2, 1] / [1, 1, 1]', () => {
    expect(
      spans([featured('a'), featured('b'), featured('c'), plain('d'), plain('e'), plain('f')]),
    ).toEqual([3, 2, 1, 1, 1, 1]);
  });

  it('only makes the first two featured projects large', () => {
    expect(spans([featured('a'), plain('b'), featured('c'), featured('d')])).toEqual([2, 1, 2, 1]);
  });

  it('always fills the last row', () => {
    expect(spans([plain('a')])).toEqual([3]);
    expect(spans([plain('a'), plain('b')])).toEqual([1, 2]);
    expect(spans([featured('a'), plain('b'), plain('c')])).toEqual([2, 1, 3]);
  });

  it('every row adds up to exactly three columns', () => {
    const items = bentoLayout([featured('a'), plain('b'), plain('c'), featured('d'), plain('e')]);
    const total = items.reduce((sum, item) => sum + item.span, 0);
    expect(total % 3).toBe(0);
  });

  it('handles an empty list', () => {
    expect(bentoLayout([])).toEqual([]);
  });
});
