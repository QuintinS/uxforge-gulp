# UXForge Shopify Gulp Workflow

To use this, you need an understanding of `npm`, `gulp` and `sass`,

## Prerequisites

- *[Node.js](https://nodejs.org/en/download/)* (*Tested on v14.15.0*) - for installing all of those Node packages, the foundation of a good development diet. 
- *[Node Package Manager](https://www.npmjs.com/get-npm)* - for installing all of those Node packages, the foundation of a good development diet.
- *[Gulp 4](https://gulpjs.com/)* - The engine that takes all your code and compiles it. [Quick Start Guide](https://gulpjs.com/docs/en/getting-started/quick-start/)
- *[Shopify Themekit](https://shopify.dev/themes/tools/theme-kit)* - uploads all compiled files to the Shopify theme.

Also recommended:

- *[Node Version Manager](https://github.com/nvm-sh/nvm)* - Makes installing the correct version of node.js easier. [Install via Homebrew](https://formulae.brew.sh/formula/nvm)

## Getting Started

### Quick Version

1. `npm install`
2. `gulp build`
3. `gulp` (or `gulp watch`) and `theme watch` - Run these in two separate terminal tabs at the same time.

Happy coding!

### Not-So-Quick Version

The project doesn't actually contain familiar `styles.scss` or `theme.scss`/`js` files in the git repo itself. Instead, the repo contains the different partials make up these files, and gulp compiles them all into the right files, which then get uploaded with Themekit. 

1. *Install Node and Node Package Manager* - Node is the Javascript server technology that powers Node Package Manager, a great tool to manage dependencies.
2. *Install Node Packages* - Using NPM, install the dependencies for this boilerplate by running `npm install` in the console.
3. *Configure Themekit* - set up Themekit's `config.yml` file, linking your local code to a Shopify theme.
4. *Test Gulp* - Run `gulp build` to test that all of the compilation is working properly. You should see some success messages in the console from this (or error messages that will help you debug what went wrong) 

If the above works, everything is ready for you to make changes to the project.

4. Open a new terminal window/tab. Run `gulp watch` to watch the working files to compile them into minified versions.
5. Open a new terminal window/tab. Run `theme watch` to watch the working files

Once this is done, you can edit all the SCSS and JS code locally and they will be compiled into production code, and uploaded via Themekit.

-----

#### Public Functions

You can run these in the console.

`gulp` - an alias for `gulp watch`
`gulp watch` - watches the files in the `_source` folder for changes, and compiles the SCSS or JS when anything is saved.
`gulp build` - Builds all of the compiled files for the whole project.

#### Private Functions

These are the different compile tasks that run under the hood.

`styleTheme` - Compiles the theme scss into `theme.css`.
`styleCustom` - Compiles the custom styles scss into `custom-styles.css`
`styleAccount` - Compiles the account styles scss into `account.css`
`styleMisc` - Compiles the misc styles into `misc.css`
`styleCheckout` - Compiles the checkout styles into `custom-checkout.css`
`scriptsTheme`  - Compiles the theme scripts into `theme.js`
`scriptsVendor` - Compiles all the vendor scripts into `vendor.js`

#### Developer Mode

At the top of the `gulpfile.js`, there's a flag called `devmode`.

When `devmode` is set to `true`, the compile tasks will write sourcemaps to help you inspect and debug source files in your browser. It will also not minify your code to make your files easier to read.

When `devmode` is set to `true`, all compiled code will be minified and no sourcemaps will be generated.

-----

### Folder Structure

- `/_source` - _contains all dev code which is compiled into production code._ This folder is intended for all the code in the plugin or product being developed.
  - `/js` - _Javascript Source._
    - `/theme` - Contains the Javascript for the theme.js file.
    - `/vendor` - Contains the Javascript for the vendor.js file.
  - `/scss` - _Sass Source._
    - `/build` - Contains the SCSS for the `custom-styles.css` file.
    - `/theme` - Contains the SCSS for the `theme.css` file.
    - `/checkout` - Contains the SCSS for the `custom-checkout.css` file.
    - `/account` - Contains the SCSS for the `account.css` file.
    - `/misc` - Contains the SCSS for the `misc.css` file.
- `/theme` - contains a standard Shopify theme folder with standard folders such as `assets` and `snippets`.
- `package.json` - contains `npm` development dependencies. Change as needed.

-----

## Authors

* **Quintin Schnehage** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
