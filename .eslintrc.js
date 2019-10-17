var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "extends": [
		"eslint:recommended",
	],
	"settings": {
		"react": {
			"createClass": "createReactClass",
			"pragma": "React",
			"version": "detect"
		}
	},
	"parser": "babel-eslint",
	"plugins": [
		"react"
	],
	"rules": {
		"space-in-parens": ["off", "always"],
		"template-curly-spacing": ["error", "always"],
		"array-bracket-spacing": ["error", "always"],
		"object-curly-spacing": ["error", "always"],
		"computed-property-spacing": ["error", "always"],
		"no-multiple-empty-lines": ["error", {"max": 1, "maxEOF": 0, "maxBOF": 0}],
		"quotes": ["warn", "single", "avoid-escape"],
		"no-use-before-define": ["error", {"functions": false}],
		"semi": ["error", "always"],
		"prefer-const": "warn",
		"react/prefer-es6-class": "off",
		"react/jsx-filename-extension": "off",
		"react/jsx-curly-spacing": "off",
		"react/jsx-indent": ["error", 2],
		"react/prop-types": ["warn"],
		"react/no-array-index-key": ["warn"],
		"class-methods-use-this": ["off", {"exceptMethods": [ "render" ]}],
		"no-undef": ["warn"],
		"no-unused-vars": ["warn"],
		"no-case-declarations": ["warn"],
		"no-return-assign": ["warn"],
		"no-param-reassign": ["warn"],
		"no-shadow": ["warn"],
		"camelcase": ["warn"],
		"no-underscore-dangle": [0, "always"],
		"max-len": ["error", { "code": 80}],
		"indent": ["error", 2],
		"comma-dangle": ["error", "never"],
		"object-curly-spacing": ["error", "always"],
		"arrow-parens": ["error", "as-needed"],
		"react/jsx-closing-bracket-location": ["warn", "tag-aligned"],
	}
}