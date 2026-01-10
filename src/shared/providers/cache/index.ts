import type { Providers } from "../types/providers";
import { RedisCacheServiceProvider } from "./implementations/RedisCacheServiceProvider";
import type { CacheServiceProvider } from "./interface/CacheServiceProvider";

export const providers: Providers<CacheServiceProvider> = {
	production: () => new RedisCacheServiceProvider(),
	development: () => new RedisCacheServiceProvider(),
};
