# Thim

# What is Thim?

Thim is a template for developing UI designs. This template uses Gulp to automate the build tasks. In this repository, there is a pre-configured and easy to customize `gulpfile.js`.

# Index
- [What is Thim?](#what-is-thim)
- [How it works?](#how-it-works)
- [Getting Started](#getting-started)
    - [Usage](#usage)
    - [Folder Structure](#folder-structure)
    - [Tasks](#tasks)
    - [Config](#config)
- [Licence](#licence)

# How it works?

...

# Getting Started

## Usage

Download and setup this repo:

- Clone this repository

    via **SSH**:
    ```
    git clone git@github.com:fhddev/thim.git
    ```
    or **HTTPS**:
    ```
    git clone https://github.com/fhddev/thim.git
    ```
    or **Github CLI**:
    ```
    gh repo clone fhddev/thim
    ```

* Navigate to the folder
    ```
    cd thim
    ```

* Install dependencies:
    ```
    npm i
    ```

* Run the development server:
    ```
    npm run dev
    ```
    or
    ```
    gulp
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

`gulpfile.js` has the following gulp tasks:

- `default`

  This is the default task. It will run the development server and build the source code with hot re-loading support.
  
  **To run this task:**

  using gulp:
  ```
  gulp
  ```

  using npm:
  ```
  npm run dev
  ```

- `releaseBuild`

  This task will build the source code to make it ready to use in production.

  **To run this task:**

  using gulp:
  ```
  gulp releaseBuild
  ```

  using npm:
  ```
  npm run build
  ```

## Config

You can config the build tasks from `gulpfile.js` file.

- `devModes` object

  In this object you can define the different modes for your project. Default are *dev* and *prod*.

  **Properies :**

  - `destDir`
  
    Specify the destination folder where the build output files will be stored. **Defualt** is `theme`.

  - `options`

    Config options for the modules and tasks used in the build process.

    **Properties :**

    - `browserSync`

      Config options for browserSync module.

      **Properties :**

      - `enable`

        True to use and run browserSync or false to skip this module in the build process.

    - `uglify`

      Config options for uglify module.

      **Properties :**

      - `enable`

        True to use and run uglify or false to skip this module in the build process.
    
    - `cleanCSS`

      Config options for cleanCSS module.

      **Properties :**

      - `enable`

        True to use and run cleanCSS or false to skip this module in the build process.
    
    - `gulpWatch`

      Config options gulp.watch function.

      **Properties :**

      - `html`
      
        **Properties**

        - `enable`

          true to watch html files or false otherwise.

      - `styles`
      
        **Properties**

        - `enable`

          true to watch scss files or false otherwise.

      - `scripts`
      
        **Properties**

        - `enable`

          true to watch js files or false otherwise.

      - `html`
      
        **Properties**

        - `enable`

          true to watch html files or false otherwise.

      - `images`
      
        **Properties**

        - `enable`

          true to watch images or false otherwise.

      - `fonts`
      
        **Properties**

        - `enable`

          true to watch fonts files or false otherwise.

















- `conf` object

  Global and common config for all tasks and env modes.

  **Properies :**

  - `env`
  
    The current env mode (*it should be read-only, to modify the prop use setupDevMode and setupProdMode functions*).

  - `paths`

    Project paths.

    **Properties :**

    - `root`

      The root path (*usually it is the directory where `gulpfile.js` is located*).

    - `srcDir`

      `src` folder path.

    - `globs`

      Globs used with `gulp.src` and `gulp.watch` functions.

    - `options`

      User-defined config for global modules used in the build task.

# Custom

## Custom environment mode

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

## Add new task

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
      ...
      "cleanDestFolders": "gulp cleanDestFolders"
    },
  ```

## Add new private task

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