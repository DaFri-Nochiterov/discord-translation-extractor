# Discord Translation Extractor

## How does it work?

Basically, it attempts to execute the webpack chunk / bundle, which contains the needed localization JS object. Then it searches for that object using the defined environment variables, which tell how and where to search.

## How can I run it?

With ease, you put the needed files into src and then just run the script or make your own.

Let's do it step by step:

### 0. What do you need:

- [Node.js](https://nodejs.org/) installed. I use the latest version available, not sure if LTS can run the script
- That's all… No additional libraries needed for the script UwU

### 1. Getting source files

First you need to obtain source webpack chunk or bundle, from which the script will extract the localization. This is probably the hardest step to make.

You need to watch for network tab in DevTools with `JS` filtering enabled:

- for site, the bundle which contains the locale JS object is loaded in the first place, it's a single VERY big file
- the client loads localization files on demand, so switch to English, reload the page and switch to the language you need — the latest loaded `.js` file is probably what you need.

Right click the file and press “Save as...” button:

Put the source file in `src` with correct name or the one you want. Defaults names are `site.js` and `client.js`. They are defined when you run the extractor, so you may change any moment you want.

### 2. Run the script

Now you need to run the script:

#### Via pre-made batch script

I've pre-made `.bat` files for the site and client, they are available in `scripts` directory. You simply run them from the root directory of project, e.g. `.\scripts\extract-client.bat`.

#### By your own

You need to tell extractor how and where to look for the localization.

Set the following environment variables:

- `EXTRACTOR_CTX` (Context). By default it is `client`, set it to the name of file you want to load, I wouldn't recommend including anything else
- `WEBPACK_IX` (Webpack Chunk Index). This one sets for which bundle you would lookup up. If you do not set it, it will take the first bundle chunk available
- `EXTRACTOR_MATCHING_ISKEY` (Matching the key?). Sets whether you want to search for the key in object or for the function.

  Why this is the thing? The site is “one” file bundle, which contains a lot of functions, when the client has the chunks for localization files which load on demand, it contains an object with ID
- `EXTRACTOR_MATCHING` (What to match?). Sets what are you looking for exactly.

  - On site you are probably looking for any string. For example, “Привет” for Russian locale

  - For the client you look for the key (remember?) or better to say, ID of language. Boo! Scared? I hope not, because **you don't really need to set this one for client**, it will match the first key available

---

Example for bash and client translations:

```bash
EXTRACTOR_CTX=client EXTRACTOR_MATCHING_ISKEY=true nodejs ./extractor.js
```

### 3. The output

The output of JSON files is stored in `out` directory. Use it how do you want, for example [make a search](https://discord-contrib.github.io/ru-i18n-issues/search.html) for the strings. 

Hope this script saved you (or will save) a little time! UwU