/**
 * Storage utilities using localforage for IndexedDB access
 */

import localforage from 'localforage';
import type { SavedScenario, Scenario } from '$lib/engine/types';

// Configure localforage
const scenarioStore = localforage.createInstance({
  name: 'magmalab',
  storeName: 'scenarios'
});

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Save a scenario
 */
export async function saveScenario(
  name: string,
  scenario: Scenario
): Promise<SavedScenario> {
  const saved: SavedScenario = {
    id: generateId(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    scenario
  };

  await scenarioStore.setItem(saved.id, saved);
  return saved;
}

/**
 * Update an existing scenario
 */
export async function updateScenario(
  id: string,
  scenario: Scenario,
  name?: string
): Promise<SavedScenario | null> {
  const existing = await scenarioStore.getItem<SavedScenario>(id);
  if (!existing) return null;

  const updated: SavedScenario = {
    ...existing,
    scenario,
    name: name ?? existing.name,
    updatedAt: Date.now()
  };

  await scenarioStore.setItem(id, updated);
  return updated;
}

/**
 * Get a scenario by ID
 */
export async function getScenario(id: string): Promise<SavedScenario | null> {
  return scenarioStore.getItem<SavedScenario>(id);
}

/**
 * Get all saved scenarios
 */
export async function getAllScenarios(): Promise<SavedScenario[]> {
  const scenarios: SavedScenario[] = [];

  await scenarioStore.iterate<SavedScenario, void>((value) => {
    scenarios.push(value);
  });

  // Sort by updated date, newest first
  scenarios.sort((a, b) => b.updatedAt - a.updatedAt);
  return scenarios;
}

/**
 * Delete a scenario
 */
export async function deleteScenario(id: string): Promise<void> {
  await scenarioStore.removeItem(id);
}

/**
 * Clear all scenarios
 */
export async function clearAllScenarios(): Promise<void> {
  await scenarioStore.clear();
}
