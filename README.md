# Thim

Thim is a template for developing UI designs. This template uses Gulp to automate the build tasks. In this repository, there is a pre-configured and easy to customize `gulpfile.js`.

# Table of content
- [What is Thim?](#thim)
- [Getting started](#getting-started)
    - [Install](#install)
    - [Usage](#usage)
    - [Folder structure](#folder-structure)
    - [Tasks](#tasks)
    - [Config](#config)
    - [User defined](#user-defined)
        - [Add environment mode](#add-environment-mode)
        - [Add task](#add-task)
        - [Add private task](#add-private-task)
- [Licence](#licence)

Prerequisites
# Getting Started

## Install

- Clone this repository

    ```
    git clone git@github.com:fhddev/thim.git
    ```

- Navigate to the root folder
    ```
    cd thim
    ```

- Install dependencies
    ```
    npm i
    ```

## Usage

- For development, run the development server :
    ```
    npm run dev
    ```

- For production, run the build command :
    ```
    npm run build
    ```

## Folder Structure

---
Here's the folder structure for this template:

```
thim/
|- src/
|-- fonts/
|-- images/
|-- js/
|-- partials/
|-- libs/
|-- scss/
|- theme/
```

|Folder|Description
|:---|:---|
|thim| Root directory |
|thim/src|Source code root directory (your html files should be placed here in this directory) |
|thim/src/fonts|All fonts |
|thim/src/images|All images |
|thim/src/js| All JS files|
|thim/src/partials|HTML partials |
|thim/src/libs| Third party libraries|
|thim/src/scss|SCSS files (IF YOU WANT TO WRITE NORMALL CSS JUST CHANGE THE FILE EXTENSION FROM .css TO .scss AND WRITE YOU NORMAL CSS) |
|thim/theme|Output file |

## Tasks

The table below shows the available gulp tasks.

|Task|Usage|Description
|:---|:---|:---|
|`default`| `gulp` or `npm run dev` | This is the default task. It will run the development server and build the source code with hot re-loading support.
|`releaseBuild`| `gulp releaseBuild` or `npm run build` | This task will build the source code to make it ready to use in production.

## Config

You can config the build tasks from `gulpfile.js` file. The table below shows the available config options.

|Name|Type|Default|Required|Description
|:---|:---:|:---:|:---:|:---|
|`devModes`|object||YES|Env modes
|`devModes.destDir`|string|theme|YES|Env modes
|`devModes.options`|object||YES|Config options for the modules and tasks used in the build process
|`devModes.option.browserSync`|object||YES|Config options for browserSync module
|`devModes.option.browserSync.enable`|boolean|true|YES|True to use the module or no otherwise
|`devModes.option.uglify`|object||YES|Config options for uglify module
|`devModes.option.uglify.enable`|boolean||YES|True to use the module or no otherwise
|`devModes.option.cleanCSS`|object||YES|Config options for cleanCSS module
|`devModes.option.cleanCSS.enable`|boolean||YES|True to use the module or no otherwise
|`devModes.option.gulpWatch`|object||YES|Config options for gulp.watch function
|`devModes.option.gulpWatch.html`|object||YES|Options for html files
|`devModes.option.gulpWatch.html.enable`|boolean||YES|True to watch the files or no otherwise
|`devModes.option.gulpWatch.styles`|object||YES|Options for style files
|`devModes.option.gulpWatch.styles.enable`|boolean||YES|True to watch the files or no otherwise
|`devModes.option.gulpWatch.scripts`|object||YES|Options for js files
|`devModes.option.gulpWatch.scripts.enable`|boolean||YES|True to watch the files or no otherwise
|`devModes.option.gulpWatch.images`|object||YES|Options for images
|`devModes.option.gulpWatch.images.enable`|boolean||YES|True to watch the files or no otherwise
|`devModes.option.gulpWatch.fonts`|object||YES|Options for fonts
|`devModes.option.gulpWatch.fonts.enable`|boolean||YES|True to watch the files or no otherwise
|`conf`|object||YES|Global config options for all tasks and env modes
|`conf.env`|object|`envMode.dev`|YES|The current env mode (*use setupDevMode or setupProdMode to modify the prop, don't modify it directly*).
|`conf.paths`|object||YES|Project paths
|`conf.paths.root`|string||YES|Root path (*usually it is the directory where `gulpfile.js` is located*)
|`conf.paths.srcDir`|string||YES|*src* folder path
|`conf.globs`|object||YES|Globs to be used with `gulp.src` and `gulp.watch` functions
|`conf.options`|object||YES|User-defined config for global modules used in the build task

# User defined

## Add environment mode

To add new environment mode :

- Copy `envModes.dev` object and add it to the `envModes` object with your new mode name and customize the config options as you want.

  **Example :**

  ```javascript
  // add 'testing' mode
  const envModes = {
    testing: {
        destDir: 'testing',
        options: {
            browserSync: {
                enable: true
            },
            uglify: {
                enable: false
            },
            cleanCSS: {
                enable: false
            },
            gulpWatch: {
                html: { enable: true },
                styles: { enable: true },
                scripts: { enable: true },
                images: { enable: true },
                fonts: { enable: true },
                libs: { enable: true }
            }
        }
    },
  ...
  ```

- Add setup functions.

  **Example :**
  
  ```javascript
  // to add testing mode setup functions.
  function setupTestingEnv(cb)
  {
    switchEnvConf('testing');
  
    cb();
  }
  ```

## Add task

To add new task :

- Add task function that will return `gulp.series` function.

  **Example :**
  ```javascript
  // to add task to clean dest folder
  function cleanDestFolderTask()
  {
    return gulp.series(
      setupProdEnv,
      deleteDestFolder,
      createDestFolder
    );
  }
  ```

- Export your task function.

  **Example :**
  ```javascript
  exports.cleanDestFolders = cleanDestFolderTask();
  ```

- Add npm command in `package.json` file (*optional*).

  ```json
  "scripts": {
      "cleanDestFolders": "gulp cleanDestFolders"
    },
  ```

## Add private task

To add new private task (sub-task) :

- Add private task function that returns `gulp.src` function or receive `cb` argument and call it in the end of the function.

  **Example :**

  ```javascript
  // example using callback
  function deleteAllDestFolders(cb)
  {
      for( let env of envModes )
      {
          fs.rmSync(env.destDir, { recursive: true, force: true });
      }
    
      cb();
  }
  ```

  ```javascript
  // example using gulp.src as the return value
  function transpilePDFFiles()
  {
      let pdfsDir = conf.env.destDir + "/fonts";

      return gulp
          .src( conf.globs.pdfs, { allowEmpty: true } )
          .pipe(gulp.dest(pdfsDir));
  }
  ```

# Licence

ISC