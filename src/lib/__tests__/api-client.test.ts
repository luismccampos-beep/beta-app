import { describe, expect, it, vi, beforeEach } from 'vitest';
import { api, ApiError } from '../api-client';

describe('api-client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('ApiError', () => {
    it('creates an error with status and body', () => {
      const error = new ApiError('Not Found', 404, { message: 'Not Found' });
      expect(error.message).toBe('Not Found');
      expect(error.status).toBe(404);
      expect(error.body).toEqual({ message: 'Not Found' });
      expect(error.isUnauthorized).toBe(false);
      expect(error.isNotFound).toBe(true);
      expect(error.isServerError).toBe(false);
    });

    it('identifies unauthorized errors', () => {
      const error = new ApiError('Unauthorized', 401);
      expect(error.isUnauthorized).toBe(true);
    });

    it('identifies server errors', () => {
      const error = new ApiError('Server Error', 500);
      expect(error.isServerError).toBe(true);
    });
  });

  describe('api.get', () => {
    it('makes a GET request and returns parsed JSON', async () => {
      const mockData = { results: [1, 2, 3] };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.get<typeof mockData>('/api/test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('appends query parameters to the URL', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await api.get('/api/test', { page: 1, q: 'hello' });
      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain('page=1');
      expect(url).toContain('q=hello');
    });

    it('throws ApiError on non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal Server Error' }),
      });

      await expect(api.get('/api/test')).rejects.toThrow(ApiError);
      await expect(api.get('/api/test')).rejects.toThrow('Internal Server Error');
    });

    it('constructs fallback message when no message in body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({}),
      });

      await expect(api.get('/api/test')).rejects.toThrow('Request failed with status 403');
    });

    it('handles 204 No Content', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => { throw new Error('No content'); },
      });

      const result = await api.get('/api/test');
      expect(result).toBeUndefined();
    });
  });

  describe('api.post', () => {
    it('sends JSON body with POST method', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      const body = { name: 'test' };
      const result = await api.post('/api/test', body);
      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe('api.put', () => {
    it('sends JSON body with PUT method', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ updated: true }),
      });

      const result = await api.put('/api/test', { key: 'value' });
      expect(result).toEqual({ updated: true });
    });
  });

  describe('api.delete', () => {
    it('sends DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ deleted: true }),
      });

      const result = await api.delete('/api/test');
      expect(result).toEqual({ deleted: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('credentials header', () => {
    it('includes credentials by default', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await api.get('/api/test');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        }),
      );
    });
  });
});