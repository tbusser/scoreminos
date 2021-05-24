/* eslint-disable @typescript-eslint/ban-types */

/*
 |------------------------------------------------------------------------------
 | Bind context decorator
 |------------------------------------------------------------------------------
 |
 | Can be used to bind the this value of a property or method to the class
 | in which it is defined.
 |
 | Source: https://www.npmjs.com/package/bind-decorator
 |
 */

export function bind<T extends Function>(
	target: object,
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
	if (!descriptor || typeof descriptor.value !== 'function') {
		throw new TypeError(
			`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
		);
	}

	return {
		configurable: true,
		get(this: T): T {
			const bound: T = descriptor.value?.bind(this);
			// Credits to https://github.com/andreypopp/autobind-decorator for
			// memoizing the result of bind against a symbol on the instance.
			Object.defineProperty(this, propertyKey, {
				value: bound,
				configurable: true,
				writable: true
			});

			return bound;
		}
	};
}
