type SubscriptionRecord = {
  subscriptionId: string;
  status: string;
  createdAt: string;
  lastEventAt?: string;
};

type SubscriptionStore = {
  subscriptions: Map<string, SubscriptionRecord>;
};

const globalForStore = globalThis as typeof globalThis & {
  subscriptionStore?: SubscriptionStore;
};

const store: SubscriptionStore =
  globalForStore.subscriptionStore ?? { subscriptions: new Map() };

globalForStore.subscriptionStore = store;

export function saveSubscription(subscriptionId: string, status: string) {
  store.subscriptions.set(subscriptionId, {
    subscriptionId,
    status,
    createdAt: new Date().toISOString(),
  });
}

export function updateSubscriptionStatus(
  subscriptionId: string,
  status: string,
  lastEventAt = new Date().toISOString()
) {
  const existing = store.subscriptions.get(subscriptionId);
  store.subscriptions.set(subscriptionId, {
    subscriptionId,
    status,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    lastEventAt,
  });
}

export function getSubscription(subscriptionId: string) {
  return store.subscriptions.get(subscriptionId) ?? null;
}
