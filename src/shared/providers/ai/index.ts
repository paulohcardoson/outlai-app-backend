import type { Providers } from "../types/providers";
import { GoogleAIServiceProvider } from "./implementations/GoogleAIServiceProvider";
import type { AIServiceProvider } from "./interface/AIServiceProvider";

export const providers: Providers<AIServiceProvider> = {
	production: () => new GoogleAIServiceProvider(),
	development: () => new GoogleAIServiceProvider(),
};
