/*global require*/
// npm install tiny-lr connect-livereload serve-index serve-static gulp-coverage gulp-mocha gulp-mocha-phantomjs es6-promise  --save-dev
(function() {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma').server,
        paths = require('./paths.json'),
        webserver
        ;
    var config = {
            liveReloadPort : 35729
            , hostConfig : {
                   https  : false
                ,  root : __dirname +"/"
                ,  host   : 'localhost'
                ,  port   : 8282
            }
        }
        ;

    function getServerPath(){
        return [
              (!!config.hostConfig.https)?'https':'http'
            , '://'
            , config.hostConfig.host
            , (config.hostConfig.port !== 80 ) ? ':'+config.hostConfig.port : ''
            ].join('');
    }

    function buildCSS() {
        var stylus = require('gulp-stylus')
            , concat = require('gulp-concat')
        ;
        return gulp.src(
                paths.dev.styl.concat(paths.dev.css)
            )
            .pipe(stylus({use: ['nib']}))
            .pipe(concat(paths.prod.cssapp))
            .pipe(gulp.dest(paths.prod.cssdir))
    }

    function buildJS() {
        var  uglify = require('gulp-uglify')
            , rename = require('gulp-rename')
            , concat = require('gulp-concat')
            , coffee = require('gulp-coffee')
        ;
        gulp.src( paths.dev.coffee )              // Read coffee files
            .pipe(
                coffee({bare:true})               // Compile coffeescript
            ).pipe(concat('all.coffee.js'))       // Combine into 1 file
            .pipe(gulp.dest(paths.dev.jsdir))
        ;


        return gulp.src( paths.dev.js )                    // Read js files
                    .pipe(concat(paths.prod.jsapp))        // Combine into 1 file
                    .pipe(gulp.dest(paths.prod.jsdir))     //
                    .pipe(uglify())                        // Minify
                    // .pipe(gulp.dest(paths.prod.jsdir))  // Write non-minified to disk
                    .pipe(rename({extname: ".min.js"}))    // Rename to ng-quick-date.min.js
                    .pipe(gulp.dest(paths.prod.jsdir))     // Write minified to disk
                    ;

    }

    gulp.task('css', buildCSS);
    gulp.task('js', buildJS);

    gulp.task('lint', function() {
        var jshint = require('gulp-jshint');
        gulp.src(
                paths.dev.js.concat(paths.gulpfile, paths.dev.test)
            )
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(jshint.reporter('jshint-stylish'));
    });


    function getStartedExpressPromise(){
        var Promise = require('es6-promise').Promise,
            promise = new Promise(function(resolve, reject) {
                try{
                    var express = require('express')
                        , app = express()
                        , serveStatic = require('serve-static')
                        , serveIndex = require('serve-index')
                        ;
                    webserver =  app
                                    .use(require('connect-livereload')())
                                    .use(serveStatic(config.hostConfig.root)) //OK
                                    .use('/' , serveIndex(config.hostConfig.root, {'icons': true}))
                                    .listen(
                                        config.hostConfig.port,
                                        function(){
                                            console.log("Local server running @ ", getServerPath() );
                                            resolve(webserver);
                                    });
                }catch(err){
                    console.log(err);
                    reject(err);
                }
            });
        return promise;
    }

    gulp.task('coverage', function (done) {
      karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
      }, done);
    });

    gulp.task('tdd', function (done) {
      karma.start({
        configFile: __dirname + '/karma.conf.js'
      }, done);
    });

    gulp.task('test', function () {
        var promise = getStartedExpressPromise();
        return promise
            .then(function(runningServer){
                    var mochaPhantomJS = require('gulp-mocha-phantomjs') ,
                        Promise = require('es6-promise').Promise,
                        phantom = mochaPhantomJS({
                                        reporter: 'spec',
                                        mocha: { },
                                        phantomjs: {
                                            ignoreSslErrors: true,
                                            viewportSize: {
                                                width: 1024,
                                                height: 768
                                            }
                                        }
                                    });

                    phantom.write({path: getServerPath()+'/test/runner.html'});
                    phantom.end();

                    return new Promise(function(resolve, reject) {
                        phantom.on('error', function(error) {
                            reject(error);
                        });
                        phantom.on('finish', function() {
                            resolve(runningServer);
                        });
                    });
            }).then(function(runningServer){
                if(runningServer){
                    runningServer.close();
                    console.log("Closed test server");
                }
            }).catch(function(e){
                gutil.log('ERROR', gutil.colors.red(e) );
            })
            ;
    });

    gulp.task('serve', function () {
        getStartedExpressPromise()
            .then(function(runningServer){
                console.log("Once server running... starting live reload");

                var tinylr = require('tiny-lr'),
                    reloadServer = tinylr();

                reloadServer.listen(config.liveReloadPort, function(){
                    console.log('tiny-lr seems to be working');
                });
                var watcher = gulp.watch( [',/app/**/*'].concat(paths.dev.html)
                                            .concat(paths.dev.js)
                                            .concat(paths.dev.css)
                                            .concat(paths.dev.images),
                            {debounceDelay: 2000},
                    function(event) {
                        var gutil = require('gulp-util'),
                            fileName = require('path').relative(config.hostConfig.root, event.path);
                        gutil.log('File',
                            gutil.colors.cyan(fileName),
                            'was',
                            gutil.colors.magenta(event.type)
                        );
                        reloadServer.changed( { body: {  files: [ fileName ] }  });
                    });
                watcher .on('end',function(){console.log('end')})
                        .on('error',function(){console.log('error')})
                        .on('ready',function(){console.log('ready')})
                        .on('nomatch',function(){console.log('nomatch')})

                return runningServer;
            });
    });

    //////////////////////////////////////////////////////////////////
    // <-- Stable working code --> //
    //////////////////////////////////////////////////////////////////



    // Default task that will be run
    // when no parameter is provided
    // to gulp
    gulp.task('default',['coverage']);


}());
