const gulp = require('gulp');
const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass')(require('sass'));
const { rimraf } = require('rimraf');
const rename = require('gulp-rename');
const gulpFileInclude = require('gulp-file-include');
const browserSync = require("browser-sync").create();
const gulpUglify = require('gulp-uglify');
const fs = require('fs');
const gulpCleanCSS = require('gulp-clean-css');


/*----------------------------------------------------------------------------
SETTINGS
----------------------------------------------------------------------------*/

const envModes = {
  dev: {
    destDir: 'theme',
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
  prod: {
    destDir: 'theme',
    options: {
      browserSync: {
        enable: false
      },
      uglify: {
        enable: false
      },
      cleanCSS: {
        enable: false
      }
    }
  }
};

let conf = {
  env: envModes.dev,
  paths: {
    root: __dirname,
    srcDir: 'src'
  },
  globs: {},
  // global module options that needs user to modify it
  options: {}
};

// init globs
conf.globs.html = [conf.paths.srcDir + '/*.html'];
conf.globs.scss = [conf.paths.srcDir + '/scss/**/*.scss', '!' + conf.paths.srcDir + '/scss/**/_*.scss'];
conf.globs.scssExclude = ['!' + conf.paths.srcDir + '/scss/**/_*.scss'];
conf.globs.js = [conf.paths.srcDir + '/js/**/*.js'];
conf.globs.images = [conf.paths.srcDir + '/images/**/*'];
conf.globs.fonts = [conf.paths.srcDir + '/fonts/**/*'];
conf.globs.libs = [conf.paths.srcDir + '/libs/**/*'];

/*----------------------------------------------------------------------------
HELPERS
----------------------------------------------------------------------------*/

function switchEnvConf(envKey)
{
  conf.env = envModes[envKey];
}

function deleteFolderOrFileSync(filePath)
{
  return fs.rmSync(filePath, { recursive: true, force: true });
}

function createFolderOrFileSync(filePath)
{
  return fs.mkdirSync(filePath);
}

/*----------------------------------------------------------------------------
PRIVATE TASKS
----------------------------------------------------------------------------*/

function setupDevEnv(cb)
{
  switchEnvConf('dev');

  cb();
}

function setupProdEnv(cb)
{
  switchEnvConf('prod');

  cb();
}

function insureDestFolderExistsAndEmpty(cb)
{
  fs.rmSync(conf.env.destDir, { recursive: true, force: true });

  fs.mkdirSync(conf.env.destDir);

  cb();
}

function transpileHTML()
{
  // delete html files from dest dir
  rimraf(conf.env.destDir + '/*.html', {
      glob: true,
      force: true,
      read: false
    }
  );

  // src (init)
  let vin = gulp.src(
    conf.globs.html,
    {
      allowEmpty: true
    }
  )

  // file include
  .pipe(
    gulpFileInclude(
      {
        allowEmpty: true
      }
    )
  )

  // dest
  .pipe(
    gulp.dest(conf.env.destDir)
  );

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function transpileStyles()
{
  let cssDir = conf.env.destDir + "/css";
  
  deleteFolderOrFileSync(cssDir);
  createFolderOrFileSync(cssDir);

  // src (init)
  let vin = gulp.src(
    [...conf.globs.scss, ...conf.globs.scssExclude],
    {
      allowEmpty: true
    }
  )

  // sassGlob
  .pipe(
    sassGlob()
  )

  // sass
  .pipe(
    sass()
  );
  
  // minify
  if( conf.env.options.cleanCSS.enable )
  {
    vin = vin.pipe(
      gulpCleanCSS()
    )
    // rename
    .pipe(
      rename({ suffix: '.min' })
    );
  }
  
  // dest
  vin = vin.pipe(
    gulp.dest(cssDir)
  );

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin = vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function transpileScripts()
{
  let jsDir = conf.env.destDir + "/js";
  
  deleteFolderOrFileSync(jsDir);
  createFolderOrFileSync(jsDir);

  // src (init)
  let vin = gulp.src(
    conf.globs.js,
    {
      allowEmpty: true
    }
  );

  // uglify
  if( conf.env.options.uglify.enable )
  {
    vin = vin.pipe(
      gulpUglify()
    )
    // rename
    .pipe(
      rename({ suffix: '.min' })
    );
  }

  // dest
  vin.pipe(
    gulp.dest(jsDir)
  );

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function transpileImages()
{
  let imagesDir = conf.env.destDir + "/images";
  
  deleteFolderOrFileSync(imagesDir);
  createFolderOrFileSync(imagesDir);

  let vin = gulp.src( conf.globs.images, { allowEmpty: true } )
    .pipe(gulp.dest(imagesDir));

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin = vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function transpileFonts()
{
  let fontsDir = conf.env.destDir + "/fonts";
  
  deleteFolderOrFileSync(fontsDir);
  createFolderOrFileSync(fontsDir);

  let vin = gulp.src( conf.globs.fonts, { allowEmpty: true } )
    .pipe(gulp.dest(fontsDir));

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin = vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function transpileLibs()
{
  let libsDir = conf.env.destDir + "/libs";
  
  deleteFolderOrFileSync(libsDir);
  createFolderOrFileSync(libsDir);

  let vin = gulp.src( conf.globs.libs, { allowEmpty: true } )
    .pipe(gulp.dest(libsDir));

  // browser sync
  if( conf.env.options.browserSync.enable )
  {
    vin = vin.pipe(
      browserSync.stream()
    );
  }

  // done
  return vin;
}

function watch(cb)
{
  if( conf.env.options?.gulpWatch?.html?.enable )
  {
    gulp.watch(conf.globs.html, gulp.series(transpileHTML));
  }

  if( conf.env.options?.gulpWatch?.styles?.enable )
  {
    gulp.watch(conf.globs.scss, gulp.series(transpileStyles));
  }

  if( conf.env.options?.gulpWatch?.scripts?.enable )
  {
    gulp.watch(conf.globs.js, gulp.series(transpileScripts));
  }

  if( conf.env.options?.gulpWatch?.images?.enable )
  {
    gulp.watch(conf.globs.images, gulp.series(transpileImages));
  }

  if( conf.env.options?.gulpWatch?.fonts?.enable )
  {
    gulp.watch(conf.globs.fonts, gulp.series(transpileFonts));
  }

  if( conf.env.options?.gulpWatch?.libs?.enable )
  {
    gulp.watch(conf.globs.libs, gulp.series(transpileLibs));
  }

  cb();
}

function serve(cb)
{
  if( conf.env.options.browserSync.enable )
  {
    browserSync.init({
        server: {
            baseDir: conf.env.destDir
        }
      }
    );
  }
  
  cb();
}

/*----------------------------------------------------------------------------
PUBLIC TASKS
----------------------------------------------------------------------------*/

function defaultTask()
{
  return gulp.series(
    setupDevEnv,
    insureDestFolderExistsAndEmpty,
    transpileHTML,
    transpileStyles,
    transpileScripts,
    transpileImages,
    transpileFonts,
    transpileLibs,
    watch,
    serve
  );
}

function releaseBuildTask()
{
  return gulp.series(
    setupProdEnv,
    insureDestFolderExistsAndEmpty,
    transpileHTML,
    transpileStyles,
    transpileScripts,
    transpileImages,
    transpileFonts,
    transpileLibs,
  );
}

/*----------------------------------------------------------------------------
EXPORTS
----------------------------------------------------------------------------*/

exports.default = defaultTask();
exports.releaseBuild = releaseBuildTask();