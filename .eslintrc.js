module.exports = {
	root: true,

	env: {
		node: true
	},

	extends: ['plugin:@typescript-eslint/recommended', 'prettier'],

	overrides: [
		{
			files: ['**/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true
			}
		}
	],

	parserOptions: {
		parser: '@typescript-eslint/parser'
	},

	plugins: ['prettier', '@typescript-eslint'],

	rules: {
		// enforce consistent spacing inside array brackets
		'array-bracket-spacing': [2, 'never'],

		// enforce return statements in callbacks of array methods
		'array-callback-return': [2],

		// enforce the use of variables within the scope they are defined
		'block-scoped-var': [2],

		// enforce consistent spacing inside single-line blocks
		'block-spacing': [2, 'always'],

		// enforce consistent brace style for blocks
		'brace-style': [2],

		// require or disallow trailing commas (comma-dangle)
		'comma-dangle': [2, 'never'],

		// enforces spacing around commas (comma-spacing)
		'comma-spacing': [2, { before: false, after: true }],

		// enforce consistent comma style
		'comma-style': [2, 'last'],

		// enforce a maximum cyclomatic complexity allowed in a program
		complexity: [1, 6],

		// enforce consistent brace style for all control statements
		curly: [2],

		// require the use of === and !==
		eqeqeq: [2, 'allow-null'],

		// enforce dot notation whenever possible
		'dot-notation': [2],

		// require or disallow spacing between function identifiers and their invocations
		'func-call-spacing': [2, 'never'],

		// require or disallow named function expressions
		'func-names': [2, 'always'],

		// enforce the consistent use of either function declarations or expressions
		'func-style': [2, 'declaration', { allowArrowFunctions: true }],

		// require for-in loops to include an if statement
		'guard-for-in': [2],

		// enforce consistent spacing between keys and values in object literal properties
		'key-spacing': [2],

		// enforce a maximum depth that blocks can be nested
		'max-depth': [2, 3],

		// require an empty line before return statements
		'newline-before-return': [2],

		// disallow the use of console
		'no-console': [2, { allow: ['error'] }],

		// disallow the use of debugger
		'no-debugger': [2],

		// disallow duplicate arguments in function definitions
		'no-dupe-args': [2],

		// disallow duplicate case labels
		'no-duplicate-case': [2],

		// disallow empty block statements
		'no-empty': [2],

		// disallow empty functions
		'no-empty-function': [2],

		// disallow the use of eval()
		'no-eval': [2],

		// disallow unnecessary calls to .bind()
		'no-extra-bind': [2],

		// disallow unnecessary labels
		'no-extra-label': [2],

		// disallow reassigning function declarations
		'no-func-assign': [2],

		// disallow the use of eval()-like methods
		'no-implied-eval': [2],

		// disallow variable or function declarations in nested blocks
		'no-inner-declarations': [2],

		// disallow the use of the __iterator__ property
		'no-iterator': [2],

		// disallow unnecessary nested blocks
		'no-lone-blocks': [2],

		// disallow function declarations and expressions inside loop statements
		'no-loop-func': [2],

		// disallow mixed spaces and tabs for indentation
		'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],

		// disallow multiple empty lines
		'no-multiple-empty-lines': [2, { max: 3 }],

		// disallow nested ternary expressions
		'no-nested-ternary': [2],

		// disallow new operators with the Function object
		'no-new-func': [2],

		// disallow new operators with the String, Number, and Boolean objects
		'no-new-wrappers': [2],

		// disallow calling global object properties as functions
		'no-obj-calls': [2],

		// turn of disallow variable redeclaration, it conflicts with typescript.
		// instead we use @typescript-eslint/no-redeclare
		'no-redeclare': 'off',

		// disallow assignments where both sides are exactly the same
		'no-self-assign': [2],

		// disallow comparisons where both sides are exactly the same
		'no-self-compare': [2],

		// disallow unmodified loop conditions
		'no-unmodified-loop-condition': [2],

		// disallow unreachable code after return, throw, continue, and break statements
		'no-unreachable': [2],

		// turn of disallow unused expressions, it conflicts with typescript.
		// instead we use @typescript-eslint/no-unused-expressions
		'no-unused-expressions': 'off',

		// disallow unnecessary calls to .call() and .apply()
		'no-useless-call': [2],

		// disallow unnecessary escape characters
		'no-useless-escape': [2],

		// disallow with statements
		'no-with': [2],

		// enforce placing object properties on separate lines
		'object-property-newline': [2, { allowMultiplePropertiesPerLine: true }],

		// require or disallow padding within blocks
		'padded-blocks': [2, 'never'],

		// require quotes around object literal property names
		'quote-props': [2, 'as-needed'],

		// enforce the consistent use of either backticks, double, or single quotes
		quotes: [2, 'single'],

		// enforce the consistent use of the radix argument when using parseInt()
		radix: [2],

		// enforce the consistent use of semicolons
		semi: [2, 'always'],

		// require or disallow strict mode directives
		strict: [2, 'global'],

		'require-atomic-updates': 'off',

		'@typescript-eslint/ban-ts-comment': 'off',

		'@typescript-eslint/no-unused-vars': [2, { args: 'none' }],

		'@typescript-eslint/no-unused-expressions': 2,

		'@typescript-eslint/no-redeclare': 2,

		'@typescript-eslint/semi': 'error',

		'prettier/prettier': 'error',

		'func-names': 'off',

		'one-var': [2, 'never']
	}
};
