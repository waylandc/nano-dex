# L2X Starter DEX

## VERY IMPORTANT DEVELOPER SETUP
Because the @oax/client library is still being refactored internally, this project only works using Akshay's 'web' branch of L2X.

1. Clone ```git clone https://gitlab.com/oax/l2x-trustless-exchange-browser-support```
	* ```pnpm run clean-build```
2. Inside this project add dependency to @oax/common and @oax/client noting the order is very important. If you add client first, you will get ramda.default is undefined errors (among others).
	* Install deps ```yarn```
	* ```yarn add ../l2x-trustless-exchange-browser-support/build/common```
	* ```yarn add ../l2x-trustless-exchange-browser-support/build/client```
3. Run locally: ```yarn start```
4. Using Chrome http://localhost:8080

## Development Setup Notes

* Prettier seems too opinionated so I've done as best I can to setup eslint so you can disable Prettier package in VSCode.

* Install ESLint vscode plugin and configure "eslint.autoFixOnSave": true in Settings

* NPM task 'build' doesn't build source maps which is what you want in Production mode. If you use the build task and expect to debug the application, remove the --no-source-maps option.


This is a React based app, created using nano and parcel.

## Routes
/home
/profile
/exchange
/orderHistory
/openOrders
