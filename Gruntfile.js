module.exports = function(grunt){

  //configure Grunt tasks
  grunt.initConfig({
    //grunt packages specified in npm file
    pkg: grunt.file.readJSON('package.json'),

    //test
    jshint: {
      files: [
        'client/**/*.js',
        'server/**/*.js'
      ],
      options: {
        //report errors without stopping task
        force: true,
        ignores: [
          //must use **/*.js to 'recursively' ignore all
          'client/lib/**/*.js'
        ]
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    //build
    useminPrepare: {
      html: ['client/**/*.html'],
      options: {
        root: 'client',
        dest: '../dist/client',
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      dist: {}
    },
    uglify: {
      dist: {}
    },
    cssmin: {
    },
    copy: {
      client: {
        expand: true,
        cwd: 'client/',
        //copying bower components to dist
        src: ['**/*.html', 'lib/**/*.*', 'images/**/*.*', 'favicon.ico'],
        dest: '../dist/client'
      },
      options: {
        force: true,
      },
      server: {
        expand: true,
        src: [
          'server.js',
          'package.json',
          'server/**/*.*'
        ],
        dest: '../dist'
      }
    },
    usemin: {
      html: ['../dist/client/**/*.html'],
      options: {
        assetsDirs: [
          '../dist/client/',
        ]
      }
    },

    //clean
    clean: {
      dist: {
        src: ['../dist/**/*', '../dist/**/*.*', '!../dist/.git'],
        options: {
          force: true
        }
      },
      tmp: {
        src: ['.tmp','.tmp/**/*.*'],
        options: {
          force: true
        }
      },
    }
  });

  //load Grunt tasks installed by npm
  require('matchdep').filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', [
    'jshint', 'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'copy:client',
    'usemin',
    'copy:server',
    'clean:tmp'
  ]);
};
