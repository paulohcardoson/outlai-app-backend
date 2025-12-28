import type { CacheServiceProvider } from "@src/shared/providers/cache/interface/CacheServiceProvider";

export class MockCacheServiceProvider implements CacheServiceProvider {
	private cache: Map<string, { value: unknown; expiry?: number }> = new Map();

	async get<T>(key: string): Promise<T | null> {
		const cached = this.cache.get(key);

		if (!cached) {
			return null;
		}

		// Check if expired
		if (cached.expiry && cached.expiry < Date.now()) {
			this.cache.delete(key);
			return null;
		}

		return cached.value as T;
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
		this.cache.set(key, { value, expiry });
	}

	async delete(key: string): Promise<void> {
		this.cache.delete(key);
	}

	// Helper method for tests to reset state
	reset(): void {
		this.cache.clear();
	}

	// Helper method to check if a key exists
	has(key: string): boolean {
		return this.cache.has(key);
	}

	// Helper method to get all keys
	keys(): string[] {
		return Array.from(this.cache.keys());
	}
}
