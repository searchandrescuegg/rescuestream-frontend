'use server';

import type { HealthResponse } from '@/types';

export async function checkApiHealth(): Promise<
  { success: true; health: HealthResponse } | { success: false; error: string }
> {
  try {
    const apiUrl = process.env.RESCUESTREAM_API_URL;
    if (!apiUrl) {
      return { success: false, error: 'API URL not configured' };
    }

    const response = await fetch(`${apiUrl}/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { success: false, error: `API returned ${response.status}` };
    }

    const health: HealthResponse = await response.json();
    return { success: true, health };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
