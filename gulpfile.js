var gulp = require("gulp");
var $ = require("gulp-load-plugins")({ lazy: true });
var args = require("yargs").argv;
var del = require("del");
var runSequence = require("run-sequence");
var path = require("path");
var config = require("./gulp.config");
var inlineTemp = require("gulp-inline-ng2-template");
var merge = require("merge-stream");
var fs = require("fs");
require("require-dir")("./gulp");

var environments = {
    development: "development",
    stage: "stage",
    qa: "qa",
    live: "live"
}
var environment;
setEnvironment();

// Linting
gulp.task("lint-client", () => {
    log("Linting client");
    var options = {
        emitError: true,
        cwd: config.client.base
    };

    return lintFiles(config.client.tsFiles, options);
});

gulp.task("lint-server", () => {
    log("Linting server")

    var options = {
        emitError: true,
        cwd: config.server.base
    };
    return lintFiles(config.server.tsFiles, options);
});

// Compiling
gulp.task("compile", (cb) => {
    runSequence(
        "clean-working-space",
        ["compile-server", "compile-client"],
        cb
    );
});

gulp.task("compile-server", ["lint-server"], () => {
    return compileServer();
});

gulp.task("compile-client", (cb) => {
    runSequence(
        ["styles"],
        "build-client-ts",
        "tranform-client-config",
        cb)
});

gulp.task("build-client-ts", ["lint-client"], () => {
    return compileClient();
});

gulp.task("build-package", (cb) => {
    runSequence("clean-dist",
        "compile",
        ["bundle", "copy-server", "copy-html", "copy-assets"],
        "inject",
        cb);
});

gulp.task("tranform-client-config", () => {
    var source = "development";
    for (var i = 0; i < config.client.configEnvironments.length; i++) {
        var configFile = config.client.configEnvironments[i];
        if (configFile.indexOf(`config.${environment}.js`) !== -1) {
            source = configFile;
            break;
        }
    }

    return gulp.src(source, { cwd: config.client.base })
        .pipe($.rename({ basename: "config" }))
        .pipe(gulp.dest(source.replace(`/config.${environment}.js`, ""), { cwd: config.client.base }));
});

gulp.task("serve", ["compile", "inject"], () => {
    var options = {
        script: config.server.nodeServer,
        delayTime: 1,
        watch: [config.server.base],
        args: ["--debug", "", "--key", "./server/UNSIGNED.key", "--crt", "./server/UNSIGNED.crt"],
        tasks: ["compile-server"]
    };

    gulp.watch(config.client.tsFiles, { cwd: config.client.base, base: config.client.base }, (event) => {
        runSequence("build-client-ts");
    });

    gulp.watch(config.client.less, { cwd: config.client.base, base: config.client.base }, (event) => {
        if (event.type !== "changed") {
            runSequence("styles", "inject");
        } else {
            runSequence("styles");
        }
    });
    return $.nodemon(options);
});

gulp.task("serve-package", ["build-package"], () => {
    var options = {
        script: config.dist.nodeServer,
        delayTime: 1,
        args: ["--debug", "", "--key", "./server/UNSIGNED.key", "--crt", "./server/UNSIGNED.crt"],
        tasks: ["compile-server"]
    };
    return $.nodemon(options);
});

gulp.task("styles", ["clean-styles"], () => {
    log("Compiling Less");
    return gulp.src(config.client.less, { cwd: config.client.base, base: config.client.base })
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ["last 5 version"] }))
        .pipe($.if(environment !== environments.development, gulp.dest(config.dist.client)))
        .pipe($.if(environment === environments.development, gulp.dest((file) => {
            return file.base;
        })));
});

function lintFiles(tsFiles, options) {
    return gulp.src(tsFiles, options)
        .pipe($.plumber())
        .pipe($.tslint({ configuration: "tslint.json" }))
        .pipe($.if(!args.teamcity, $.tslint.report("prose", options)))
        .pipe($.if(args.teamcity, $.tslint.report($.tslintTeamcity, options)));
}

function compileServer() {
    log("Compiling server");

    var tsConfig = JSON.parse(fs.readFileSync(config.server.tsConfig, "utf8"));

    return gulp.src([].concat(
        config.server.definitions, config.server.tsFiles),
        { cwd: config.server.base, base: config.server.base })
        .pipe($.plumber())
        .pipe($.if(environment === environments.development, $.sourcemaps.init()))
        .pipe($.typescript(tsConfig.compilerOptions))
        .pipe($.if(environment === environments.development, $.sourcemaps.write(".")))
        .pipe(gulp.dest(config.server.base));
}

function compileClient() {
    log("Compiling client");

    var tsConfig = JSON.parse(fs.readFileSync(config.client.tsConfig, "utf8"));

    var files = [config.client.definitions]
        .concat(config.client.tsFiles);
    var stream = gulp.src(files, { cwd: config.client.base, base: config.client.base })
        .pipe($.plumber())
        .pipe($.if(environment === environments.development, $.sourcemaps.init()))
        .pipe($.typescript(tsConfig.compilerOptions))
        .pipe($.if(environment === environments.development, $.sourcemaps.write(".")))
        .pipe($.if(environment !== environments.development, $.replace("\"use strict\";", "")))
        .pipe(gulp.dest((file) => {
            return file.base;
        }));

    return stream;
}

// Cleaning/Copy tasks
gulp.task("clean-styles", (done) => {
    clean(config.client.styles, done);
});

gulp.task("clean-dist", (done) => {
    clean(config.dist.base, done);
});

gulp.task("clean-working-space", (done) => {
    clean(config.client.compiledJs.concat(config.server.compiledJs), done);
});

gulp.task("copy-assets", () => {
    var assets = gulp.src(config.client.assets, { base: config.client.base + "assets/" })
        .pipe($.plumber())
        .pipe(gulp.dest(config.dist.clientAssets));

    var componentAssets = gulp.src(config.client.componentAssets, { base: config.client.base })
        .pipe($.plumber())
        .pipe(gulp.dest(config.dist.client));

    return merge(assets, componentAssets);
});

gulp.task("copy-lib", () => {
    return gulp.src(config.client.lib)
        .pipe($.plumber())
        .pipe(gulp.dest(config.dist.clientLib));
});

gulp.task("copy-server", () => {
    return gulp.src(config.server.distributableFiles)
        .pipe($.plumber())
        .pipe(gulp.dest(config.dist.server));
});

gulp.task("copy-html", () => {
    return gulp.src(config.client.htmlFiles, { base: config.client.base })
        .pipe($.plumber())
        .pipe(gulp.dest(config.dist.client));
});

//automatic injection
gulp.task("inject", () => {
    return inject();
});

function inject() {
    log("Injecting js/css dependencies in index.html");

    var srcBase = config.client.base;
    var jsFiles = [];

    if (environment !== environments.development) {
        srcBase = config.dist.client;
        config.client.vendors.forEach((vendor) => {
            jsFiles.push(`vendors/${vendor}`);
        });
    } else {
        config.client.vendors.forEach((vendor) => {
            jsFiles.push(`node_modules/${vendor}`);
        });
    }

    var styles = gulp.src(config.client.injectStyles, { cwd: srcBase });
    var js = gulp.src(jsFiles, { cwd: srcBase, read: false });
    var stream = gulp.src(config.client.indexHtml,
        { cwd: srcBase })
        .pipe($.plumber())
        .pipe($.inject(styles, {
            addRootSlash: false,
            relative: true
        }))
        .pipe($.inject(js, {
            addRootSlash: false,
            relative: true
        }))
        .pipe(gulp.dest(srcBase));

    return stream;
}

// Test for backend
gulp.task("test-node", ["compile-server"], () => {
    return gulp.src('**/spec.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha());

})

// Helpers
function setEnvironment() {
    environment = args.env || environments.development;
    process.env.NODE_ENV = environment;

    transformGulpConfig(environment);
}

function transformGulpConfig(environment) {
    if (!isValidEnvironment(environment))
        throw ("Error: Invalid environment \"" + environment + "\".");
    if (environment === environments.development) return;

    log("Transforming config to environment: " + environment);
    var newConfig = require("./gulp.config." + environment);
    deepExtend(config, newConfig);
}

function isValidEnvironment(environment) {
    return environment === environments.development || environment === environments.stage ||
        environment === environments.qa || environment === environments.live;
}

function deepExtend(destination, source) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
}

function clean(path, done) {
    log("Cleaning: " + $.util.colors.blue(path));

    del(path).then(() => {
        done();
    });
}

function log(msg) {
    $.util.log($.util.colors.blue(msg));
}