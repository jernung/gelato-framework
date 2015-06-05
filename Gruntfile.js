var globals = require('./bin/globals.js');
var reload = require('./bin/reload.js');

module.exports = function(grunt) {

    /**
     * @property options
     * @type Object
     */
    var options = {
        appname: grunt.option('appname'),
        architecture: grunt.option('architecture') === undefined ? 'arm' : grunt.option('architecture'),
        hostname: grunt.option('hostname') === undefined ? 'localhost' : grunt.option('hostname'),
        name: grunt.option('name') || false,
        noclean: grunt.option('noclean') || false,
        novalidate: grunt.option('novalidate') || false,
        port: grunt.option('port') === undefined ? '8080' : grunt.option('port'),
        protocol: grunt.option('protocol') === undefined ? 'http' : grunt.option('protocol')
    };

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        /**
         * GLOBALS
         */
        globals: globals,
        /**
         * OPTIONS
         */
        options: options,
        /**
         * CLEAN
         */
        clean: {
            'compile-build': {
                src: [
                    '<%= globals.project.build.path %>/cordova',
                    '<%= globals.project.build.path %>/core/modules/**/*',
                    '!<%= globals.project.build.path %>/core/modules/GelatoJasmine.js',
                    '!<%= globals.project.build.path %>/core/modules/GelatoLibraries.js',
                    '!<%= globals.project.build.path %>/core/modules/GelatoTests.js',
                    '<%= globals.project.build.path %>/modules/**/*',
                    '!<%= globals.project.build.path %>/modules/Application.js',
                    '!<%= globals.project.build.path %>/modules/Libraries.js',
                    '!<%= globals.project.build.path %>/modules/Tests.js'
                ],
                options: {force: true}
            },
            'cordova': {
                src: [
                    '<%= globals.project.path %>/cordova'
                ],
                options: {force: true}
            },
            'cordova-android': {
                src: [
                    '<%= globals.project.path %>/cordova/platforms/android'
                ],
                options: {force: true}
            },
            'cordova-android-cordovalib': {
                src: [
                    '<%= globals.project.cordova.platforms.android.cordovalib.path %>/**/*'
                ],
                options: {force: true}
            },
            'cordova-www': {
                src: [
                    '<%= globals.project.path %>/cordova/www/**/*'
                ],
                options: {force: true}
            },
            'docs': {
                src: [
                    '<%= globals.project.docs.path %>'
                ],
                options: {force: true}
            },
            'project-gelato': {
                src: [
                    '<%= globals.project.gelato.path %>/**/*'
                ],
                options: {force: true}
            },
            'project-www': {
                src: [
                    '<%= globals.project.www.path %>/**/*'
                ],
                options: {force: true}
            }
        },
        /**
         * COFFEE
         */
        coffee: {
            'project-www': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: '**/*.coffee',
                        dest: '<%= globals.project.www.path %>',
                        ext: '.js'
                    },
                    {
                        expand: true,
                        cwd: '<%= globals.project.src.path %>',
                        src: '**/*.coffee',
                        dest: '<%= globals.project.www.path %>',
                        ext: '.js'
                    }
                ]
            }
        },
        /**
         * CONNECT
         */
        connect: {
            'project-www': {
                options: {
                    base: '<%= globals.project.www.path %>',
                    hostname: '<%= options.hostname %>',
                    keepalive: true,
                    open: {
                        appName: '<%= options.appname %>'
                    },
                    port: '<%= options.port %>',
                    protocol: '<%= options.protocol %>'
                }
            }
        },
        /**
         * COPY
         */
        copy: {
            'cordova-android-apk': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.project.cordova.platforms.android.path %>/ant-build',
                        src: ['MainActivity-debug.apk', 'MainActivity-release-unsigned.apk'],
                        dest: '<%= globals.project.build.path %>/android',
                        rename: function(dest, src) {
                            return dest + '/' + src.replace('MainActivity-', globals.project.pkg.name + '-' + options.architecture + '-');
                        }
                    }
                ]
            },
            'cordova-config': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.project.www.path %>/cordova',
                        src: ['**/*'],
                        dest: '<%= globals.project.cordova.path %>'
                    }
                ]
            },
            'cordova-www': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.project.www.path %>',
                        src: ['**/*', '!cordova/**/*'],
                        dest: '<%= globals.project.cordova.www.path %>'
                    }
                ]
            },
            'project-gelato': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: ['core/**/*', '!**/*.coffee', '!**/*.jade', '!**/*.jsx', '!**/*.scss', '!README.md'],
                        dest: '<%= globals.project.gelato.path %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= globals.framework.includes.path %>',
                        src: ['plugins/**/*'],
                        dest: '<%= globals.project.gelato.path %>'
                    }
                ]
            },
            'project-www': {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: ['**/*', '!**/*.coffee', '!**/*.jade', '!**/*.jsx', '!**/*.scss', '!README.md'],
                        dest: '<%= globals.project.www.path %>'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= globals.project.src.path %>',
                        src: ['**/*', '!**/*.coffee', '!**/*.jade', '!**/*.jsx', '!**/*.scss', '!README.md'],
                        dest: '<%= globals.project.www.path %>'
                    }
                ]
            },
            'structure': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.includes.structure.path %>/',
                        src: [
                            'copy-gitattributes',
                            'copy-gitignore',
                            'copy-package',
                            'copy-readme'
                        ],
                        dest: '<%= globals.project.path %>',
                        rename: function(dest, src) {
                            switch (src) {
                                case 'copy-gitattributes':
                                    return dest + '/.gitattributes';
                                case 'copy-gitignore':
                                    return dest + '/.gitignore';
                                case 'copy-package':
                                    return dest + '/package.json';
                                case 'copy-readme':
                                    return dest + '/README.md';
                            }
                            return dest + '/' + src;
                        }
                    }
                ]
            }
        },
        /**
         * CSSLINT
         */
        csslint: {
            'project-www': {
                options: {
                    csslintrc: '.csslintrc',
                    import: 2
                },
                src: [
                    '<%= globals.project.www.path %>/styles/main.css'
                ]
            }
        },
        /**
         * JADE
         */
        jade: {
            'project-www': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: ['**/*.jade'],
                        dest: '<%= globals.project.www.path %>',
                        ext: '.html'
                    },
                    {
                        expand: true,
                        cwd: '<%= globals.project.src.path %>',
                        src: ['**/*.jade'],
                        dest: '<%= globals.project.www.path %>',
                        ext: '.html'
                    }
                ]
            }
        },
        /**
         * JSHINT
         */
        jshint: {
            'project-www': {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [
                    'Gruntfile.js',
                    '<%= globals.project.www.path %>/core/config/**/*.js',
                    '<%= globals.project.www.path %>/core/modules/**/*.js',
                    '<%= globals.project.www.path %>/modules/**/*.js'
                ]
            }
        },
        /**
         * REACT
         */
        react: {
            'project-www': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: '**/*.jsx',
                        dest: '<%= globals.project.www.path %>',
                        ext: '.js'
                    },
                    {
                        expand: true,
                        cwd: '<%= globals.project.src.path %>',
                        src: '**/*.jsx',
                        dest: '<%= globals.project.www.path %>',
                        ext: '.js'
                    }
                ]
            }
        },
        /**
         * REPLACE
         */
        replace: {
            'cordova-config': {
                options: {
                    variables: {
                        'description': '<%= globals.project.pkg.description %>',
                        'packageBundleVersion': '<%= globals.project.pkg.version %>',
                        'packageId': '<%= globals.project.pkg.packageId %>',
                        'packageName': '<%= globals.project.pkg.packageName %>',
                        'packageVersionCode': function() {
                            return globals.project.pkg['packageVersionCode-' + options.architecture];
                        },
                        'version': '<%= globals.project.pkg.version %>'
                    }
                },
                files: [
                    {
                        expand: true,
                        src: ['config.xml'],
                        cwd: '<%= globals.project.cordova.path %>',
                        dest: '<%= globals.project.cordova.path %>'
                    }
                ]
            },
            'cordova-manifest': {
                options: {
                    patterns: [{
                        match: '"10" android:targetSdkVersion',
                        replacement: '"16" android:targetSdkVersion'
                    }],
                    usePrefix: false
                },
                files: [
                    {
                        src: 'AndroidManifest.xml',
                        dest: '<%= globals.project.cordova.platforms.android.path %>',
                        expand: true,
                        cwd: '<%= globals.project.cordova.platforms.android.path %>'
                    }
                ]
            },
            'project-www': {
                options: {
                    variables: {
                        'application-date': new Date().toISOString(),
                        'application-description': '<%= globals.project.pkg.description %>',
                        'application-name': '<%= globals.project.pkg.name %>',
                        'application-title': '<%= globals.project.pkg.title %>',
                        'application-version': '<%= globals.project.pkg.version %>',
                        'framework-version': '<%= globals.framework.pkg.version %>',
                        'security-policy': '<%= globals.project.pkg.securityPolicy %>'
                    }
                },
                files: [
                    {
                        expand: true,
                        src: ['index.html', 'tests.html'],
                        cwd: '<%= globals.project.www.path %>',
                        dest: '<%= globals.project.www.path %>'
                    },
                    {
                        expand: true,
                        src: 'core/config/gelato.js',
                        cwd: '<%= globals.project.www.path %>',
                        dest: '<%= globals.project.www.path %>'
                    },
                    {
                        expand: true,
                        src: 'locale/nls/**/*.js',
                        cwd: '<%= globals.project.www.path %>',
                        dest: '<%= globals.project.www.path %>'
                    }
                ]
            },
            'structure': {
                options: {
                    variables: {
                        'project-name': '<%= options.name %>'
                    }
                },
                files: [
                    {
                        expand: true,
                        src: ['package.json', 'README.md'],
                        cwd: '<%= globals.project.path %>',
                        dest: '<%= globals.project.path %>'
                    }
                ]
            }
        },
        /**
         * REQUIREJS
         */
        requirejs: {
            'compile-build': {
                options: {
                    baseUrl: globals.project.www.path,
                    dir: globals.project.build.path,
                    fileExclusionRegExp: null,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: globals.project.config.modules,
                    optimize: 'uglify',
                    optimizeCss: 'standard',
                    paths: globals.project.config.paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: globals.project.config.shim
                }
            }
        },
        /**
         * SASS
         */
        sass: {
            'project-www': {
                files: [
                    {
                        expand: true,
                        cwd: '<%= globals.framework.src.path %>',
                        src: ['core/styles/gelato.scss'],
                        dest: '<%= globals.project.www.path %>',
                        ext: '.css'

                    },
                    {
                        expand: true,
                        cwd: '<%= globals.project.src.path %>',
                        src: ['fonts.scss', 'styles.scss'],
                        dest: '<%= globals.project.www.path %>',
                        ext: '.css'
                    }
                ],
                options: {
                    sourcemap: 'none'
                }
            }
        },
        /**
         * SHELL
         */
        shell: {
            'build-cordova-android': {
                command: [
                    'cd <%= globals.project.cordova.path %>',
                    'cordova build android'
                ].join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'build-cordova-android-release': {
                command: [
                    'cd <%= globals.project.cordova.path %>',
                    'cordova build android --release'
                ].join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova': {
                command: [
                    'cd <%= globals.project.path %>',
                    'cordova create cordova <%= globals.project.pkg.packageId %> "<%= globals.project.pkg.packageName %>"'
                ].join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-android': {
                command: [
                    'cd <%= globals.project.cordova.path %>',
                    'cordova platform add android'
                ].join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'install-cordova-plugins': {
                command: [
                    'cd <%= globals.project.cordova.path %>',
                    'cordova plugin add cordova-plugin-crosswalk-webview',
                    'cordova plugin add cordova-plugin-device',
                    'cordova plugin add <%= globals.framework.includes.plugins.path %>/core'
                ].concat(globals.project.config.plugins.map(function(plugin) {
                        if (['chartboost', 'google-analytics', 'google-playservices'].indexOf(plugin) > -1) {
                            return 'cordova plugin add ' + globals.framework.includes.plugins.path + '/' + plugin;
                        }
                        return 'cordova plugin add ' + plugin;
                    })
                ).join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            'restart-adb': {
                command: [
                    'adb kill-server',
                    'adb start-server'
                ].join(' && '),
                options: {
                    failOnError: false,
                    stderr: true,
                    stdout: true
                }
            },
            'run-cordova-android': {
                command: [
                    'cd <%= globals.project.cordova.path %>',
                    'cordova run android'
                ].join(' && '),
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        },
        /**
         * WATCH
         */
        watch: {
            'project-src': {
                files: [
                    '<%= globals.project.path %>/**/*.coffee',
                    '<%= globals.project.path %>/**/*.css',
                    '<%= globals.project.path %>/**/*.html',
                    '<%= globals.project.path %>/**/*.jade',
                    '<%= globals.project.path %>/**/*.js',
                    '<%= globals.project.path %>/**/*.jsx',
                    '<%= globals.project.path %>/**/*.scss'
                ],
                tasks: ['build-www'],
                options: {
                    spawn: false
                }
            }
        },
        /**
         * YUIDOC
         */
        yuidoc: {
            'default': {
                name: '<%= globals.project.pkg.name %>',
                description: '<%= globals.project.pkg.description %>',
                version: '<%= globals.project.pkg.version %>',
                options: {
                    paths: ['<%= globals.framework.src.path %>', '<%= globals.project.src.path %>'],
                    themedir: '<%= globals.project.src.path %>/yuidoc',
                    outdir: '<%= globals.project.docs.path %>'
                }
            }
        }
    });

    /**
     * TASK: build-android
     */
    grunt.registerTask('build-android', function() {
        grunt.task.run([
            'build-www',
            'clean:cordova-www',
            'copy:cordova-www',
            'copy:cordova-config',
            'replace:cordova-config'
        ]);
    });

    /**
     * TASK: build-www
     */
    grunt.registerTask('build-www', function() {
        if (options.noclean) {
            grunt.log.writeln('Skipping clean.');
        } else {
            grunt.task.run('clean:project-www');
        }
        grunt.task.run([
            'coffee:project-www',
            'jade:project-www',
            'sass:project-www',
            'copy:project-www',
            'replace:project-www'
        ]);
        if (options.novalidate) {
            grunt.log.writeln('Skipping validation.');
        } else {
            grunt.task.run('validate-www');
        }
    });

    /**
     * TASK: compile-www
     */
    grunt.registerTask('compile-www', function() {
        grunt.task.run([
            'build-www',
            'requirejs:compile-build',
            'clean:compile-build'
        ]);
    });

    /**
     * TASK: create-project
     */
    grunt.registerTask('create-project', function() {
        process.env.projectPath = globals.project.path + '/' + options.name;
        globals = reload('./globals.js');
        grunt.file.mkdir(globals.project.path);
        grunt.config.set('globals', globals);
        grunt.task.run([
            'copy:structure',
            'replace:structure',
            'install-gelato'
        ]);
    });

    /**
     * TASK: docs
     */
    grunt.registerTask('docs', function() {
        grunt.task.run([
            'clean:docs',
            'yuidoc:default'
        ]);
    });

    /**
     * TASK: install-cordova
     */
    grunt.registerTask('install-cordova', function() {
        grunt.task.run([
            //install cordova
            'clean:cordova',
            'shell:install-cordova',
            //install cordova android
            'clean:cordova-android',
            'shell:install-cordova-android',
            'replace:cordova-manifest',
            //install cordova plugins
            'shell:install-cordova-plugins'
        ]);
    });

    /**
     * TASK: install-gelato
     */
    grunt.registerTask('install-gelato', function() {
        grunt.task.run([
            'clean:project-gelato',
            'copy:project-gelato'
        ]);
    });

    /**
     * TASK: RELEASE-ANDROID
     */
    grunt.registerTask('release-android', function() {
        grunt.task.run([
            'build-android',
            'shell:build-cordova-android-release',
            'copy:cordova-android-apk'
        ]);
    });

    /**
     * TASK: run-android
     */
    grunt.registerTask('run-android', function() {
        var cordovaPath = grunt.file.isFile(globals.project.cordova.path + '/config.xml');
        if (cordovaPath) {
            grunt.task.run([
                'build-www',
                'build-android',
                'shell:run-cordova-android',
                'shell:restart-adb'
            ]);
        } else {
            grunt.log.error('Cordova is not installed for this project.');
        }
    });

    /**
     * TASK: run-web
     */
    grunt.registerTask('run-web', function() {
        grunt.task.run([
            'connect:project-www'
        ]);
    });

    /**
     * TASK: validate
     */
    grunt.registerTask('validate-www', function() {
        grunt.task.run([
            'csslint:project-www',
            'jshint:project-www'
        ]);
    });

    /**
     * TASK: validate
     */
    grunt.registerTask('watch-project', function() {
        grunt.task.run([
            'build-www',
            'watch:project-src'
        ]);
    });

};
