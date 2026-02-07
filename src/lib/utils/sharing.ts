/**
 * URL sharing utilities
 * Compress scenario to URL-safe string for sharing
 */

import LZString from 'lz-string';
import type { Scenario } from '$lib/engine/types';

/**
 * Encode a scenario to a URL-safe compressed string
 */
export function encodeScenario(scenario: Scenario): string {
  const json = JSON.stringify(scenario);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decode a scenario from a compressed string
 */
export function decodeScenario(encoded: string): Scenario | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as Scenario;
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for a scenario
 */
export function generateShareUrl(scenario: Scenario, baseUrl?: string): string {
  const encoded = encodeScenario(scenario);
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/build?s=${encoded}`;
}

/**
 * Parse a scenario from URL search params
 */
export function parseScenarioFromUrl(searchParams: URLSearchParams): Scenario | null {
  const encoded = searchParams.get('s');
  if (!encoded) return null;
  return decodeScenario(encoded);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}
