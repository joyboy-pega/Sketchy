import type { z } from 'zod';
import { errorEnvelopeSchema, type ErrorCode } from './contract/errors.js';
import {
  guestAuthRequestSchema,
  guestAuthResponseSchema,
  meResponseSchema,
  patchMeRequestSchema,
  type GuestAuthRequest,
  type GuestAuthResponse,
  type MeResponse,
  type PatchMeRequest,
} from './contract/players.js';
import {
  createRoomRequestSchema,
  createRoomResponseSchema,
  roomResolutionSchema,
  type CreateRoomRequest,
  type CreateRoomResponse,
  type RoomResolution,
} from './contract/rooms.js';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken: () => string | null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.getToken = config.getToken ?? (() => null);
  }

  private async request<T>(
    method: string,
    path: string,
    schema: z.ZodType<T>,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }

    if (!response.ok) {
      const parsed = errorEnvelopeSchema.safeParse(json);
      if (parsed.success) {
        throw new ApiError(response.status, parsed.data.error.code, parsed.data.error.message);
      }
      throw new ApiError(response.status, 'internal', `HTTP ${response.status}`);
    }

    return schema.parse(json);
  }

  async guestAuth(req: GuestAuthRequest): Promise<GuestAuthResponse> {
    const valid = guestAuthRequestSchema.parse(req);
    return this.request('POST', '/v1/auth/guest', guestAuthResponseSchema, valid);
  }

  async getMe(): Promise<MeResponse> {
    return this.request('GET', '/v1/players/me', meResponseSchema);
  }

  async patchMe(req: PatchMeRequest): Promise<MeResponse> {
    const valid = patchMeRequestSchema.parse(req);
    return this.request('PATCH', '/v1/players/me', meResponseSchema, valid);
  }

  async createRoom(req?: CreateRoomRequest): Promise<CreateRoomResponse> {
    const valid = createRoomRequestSchema.parse(req ?? {});
    return this.request('POST', '/v1/rooms', createRoomResponseSchema, valid);
  }

  async resolveRoom(code: string): Promise<RoomResolution> {
    return this.request('GET', `/v1/rooms/${encodeURIComponent(code)}`, roomResolutionSchema);
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
