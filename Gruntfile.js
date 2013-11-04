/*
 * grunt-js-modularize
 * https://github.com/owilliams/grunt-js-modularize
 *
 * Copyright (c) 2013 Owain Williams
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    'default': {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!',
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
    },

    // Configuration to be run (and then tested).
    'js-modularize': {
      dest_files: {
        files: {
          'tmp/simple_dest.js': ['test/fixtures/simple.json'],
          'tmp/array_dest.js': 'test/fixtures/array.json'
        },
      },
      default_options: {
        src: ['test/fixtures/**/*.json']
      },
      template_option: {
        options: {
          destinationFileTemplate: 'tmp/<%= filename %>_template.js'
        },
        files:[
          {src: 'test/fixtures/**/*.json'}
        ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*-test.js'],
    },

    watch: {
      tests: {
        files: ['**/*.js'],
        tasks: ['jshint', 'test']
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'js-modularize', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
