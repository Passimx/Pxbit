import { describe, expect, it } from 'vitest';

import { makeStore } from '@/store/store';

import { decrement, increment, incrementBy, reset, selectCount } from './counterSlice';

describe('counterSlice', () => {
  it('начинает с нуля', () => {
    const store = makeStore();
    expect(selectCount(store.getState())).toBe(0);
  });

  it('обрабатывает increment, decrement, incrementBy и reset', () => {
    const store = makeStore();
    store.dispatch(increment());
    store.dispatch(incrementBy(5));
    store.dispatch(decrement());
    expect(selectCount(store.getState())).toBe(5);

    store.dispatch(reset());
    expect(selectCount(store.getState())).toBe(0);
  });
});
