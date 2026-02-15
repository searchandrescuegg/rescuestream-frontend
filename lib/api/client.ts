/**
 * RescueStream API Client with HMAC-SHA256 Authentication
 * Server-side only - never import in Client Components
 */

import crypto from 'crypto';
import type {
  Broadcaster,
  BroadcastersResponse,
  StreamKey,
  StreamKeysResponse,
  Stream,
  StreamsResponse,
  HealthResponse,
  APIError,
  CreateBroadcasterRequest,
  UpdateBroadcasterRequest,
  CreateStreamKeyRequest,
  AuditLogsResponse,
  AuditLogEntry,
  CreateAuditLogRequest,
} from '@/types';

class RescueStreamClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    const baseUrl = process.env.RESCUESTREAM_API_URL;
    const apiKey = process.env.RESCUESTREAM_API_KEY;
    const apiSecret = process.env.RESCUESTREAM_API_SECRET;

    if (!baseUrl || !apiKey || !apiSecret) {
      throw new Error(
        'RescueStream API configuration missing. Required env vars: RESCUESTREAM_API_URL, RESCUESTREAM_API_KEY, RESCUESTREAM_API_SECRET'
      );
    }

    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private generateSignature(
    method: string,
    path: string,
    timestamp: number,
    body: string
  ): string {
    const stringToSign = `${method}\n${path}\n${timestamp}\n${body}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(stringToSign)
      .digest('hex');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const bodyString = body ? JSON.stringify(body) : '';
    // Extract path without query string for signature (backend expects path only)
    const pathForSignature = path.split('?')[0];
    const signature = this.generateSignature(method, pathForSignature, timestamp, bodyString);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: bodyString || undefined,
    });

    if (!response.ok) {
      const error: APIError = await response.json().catch(() => ({
        type: '/errors/unknown',
        title: 'Unknown Error',
        status: response.status,
        detail: response.statusText,
        instance: path,
      }));
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Health Check
  async checkHealth(): Promise<HealthResponse> {
    // Health endpoint doesn't require authentication
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  // Streams
  async listStreams(): Promise<StreamsResponse> {
    return this.request<StreamsResponse>('GET', '/streams');
  }

  async getStream(id: string): Promise<Stream> {
    return this.request<Stream>('GET', `/streams/${id}`);
  }

  // Broadcasters
  async listBroadcasters(): Promise<BroadcastersResponse> {
    return this.request<BroadcastersResponse>('GET', '/broadcasters');
  }

  async getBroadcaster(id: string): Promise<Broadcaster> {
    return this.request<Broadcaster>('GET', `/broadcasters/${id}`);
  }

  async createBroadcaster(data: CreateBroadcasterRequest): Promise<Broadcaster> {
    return this.request<Broadcaster>('POST', '/broadcasters', data);
  }

  async updateBroadcaster(
    id: string,
    data: UpdateBroadcasterRequest
  ): Promise<Broadcaster> {
    return this.request<Broadcaster>('PATCH', `/broadcasters/${id}`, data);
  }

  async deleteBroadcaster(id: string): Promise<void> {
    return this.request<void>('DELETE', `/broadcasters/${id}`);
  }

  // Stream Keys
  async listStreamKeys(): Promise<StreamKeysResponse> {
    return this.request<StreamKeysResponse>('GET', '/stream-keys');
  }

  async getStreamKey(id: string): Promise<StreamKey> {
    return this.request<StreamKey>('GET', `/stream-keys/${id}`);
  }

  async createStreamKey(data: CreateStreamKeyRequest): Promise<StreamKey> {
    return this.request<StreamKey>('POST', '/stream-keys', data);
  }

  async revokeStreamKey(id: string): Promise<void> {
    return this.request<void>('DELETE', `/stream-keys/${id}`);
  }

  // Audit Logs
  async listAuditLogs(queryString: string): Promise<AuditLogsResponse> {
    return this.request<AuditLogsResponse>('GET', `/audit-logs${queryString ? `?${queryString}` : ''}`);
  }

  async createAuditLog(data: CreateAuditLogRequest): Promise<AuditLogEntry> {
    return this.request<AuditLogEntry>('POST', '/audit-events', data);
  }
}

// Singleton instance
let clientInstance: RescueStreamClient | null = null;

export function getRescueStreamClient(): RescueStreamClient {
  if (!clientInstance) {
    clientInstance = new RescueStreamClient();
  }
  return clientInstance;
}

// Export types for use
export type { RescueStreamClient };
