import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({
	tsconfig: {
		verbatimModuleSyntax: false,
		esModuleInterop: true,
		experimentalDecorators: true,
		emitDecoratorMetadata: true,
		module: "ESNext",
		moduleResolution: "node",
	},
});

export default {
	...presetConfig,
	collectCoverage: true,
	collectCoverageFrom: ["src/features/**/*.service.ts"],
	extensionsToTreatAsEsm: [".ts"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@src/(.*)$": "<rootDir>/src/$1",
		"^@api/(.*)$": "<rootDir>/src/api/$1",
		"^@config/(.*)$": "<rootDir>/src/shared/config/$1",
		"^@features/(.*)$": "<rootDir>/src/features/$1",
		"^@shared/(.*)$": "<rootDir>/src/shared/$1",
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	testMatch: ["**/tests/**/*.test.ts"],
	testEnvironment: "node",
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: {
					verbatimModuleSyntax: false,
					esModuleInterop: true,
					experimentalDecorators: true,
					emitDecoratorMetadata: true,
					module: "ESNext",
					moduleResolution: "node",
				},
			},
		],
	},
};
