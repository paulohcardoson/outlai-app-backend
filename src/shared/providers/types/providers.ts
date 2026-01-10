export type Providers<T> = {
	production: () => T;
	development: () => T;
};
