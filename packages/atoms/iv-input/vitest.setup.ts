class TestMutationObserver implements MutationObserver {
  disconnect() {}

  observe() {}

  takeRecords() {
    return [];
  }
}

Object.assign(globalThis, {
  MutationObserver: globalThis.MutationObserver || TestMutationObserver,
});
