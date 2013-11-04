/*
 * grunt-js-modularize
 * https://github.com/owilliams/grunt-js-modularize
 *
 * Copyright (c) 2013 Owain Williams
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-task

  var _s = require('underscore.string');

  grunt.registerMultiTask('js-modularize', 'Turn JSON files into JavaScript ES6 modules.', function() {

    //
    var moduleTemplate = 'var <%= name %> = <%= text %>;\n\nexport default <%= name %>;';
    var optionPath = this.name + '.' + this.target + '.options';

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      destinationFileTemplate: '<%= path %>/<%= filename %>.js'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {

      file.src.forEach(function(src){
        var destinationFilename = file.dest;
        var json = grunt.file.read(src);
        var srcParts = utils.extractFileInfo(src);

        var jsModule = grunt.template.process(moduleTemplate, {
          'data': {
            text: json,
            name: _s.camelize(srcParts.filename)
          }
        });

        if (!destinationFilename || destinationFilename === ''){
          var destinationFileTemplate = grunt.config.getRaw(optionPath + '.destinationFileTemplate') || options.destinationFileTemplate;
          destinationFilename = grunt.template.process(destinationFileTemplate, {
            data: srcParts
          });

          if (!destinationFilename || destinationFilename === ''){
            grunt.fail.fatal('No destination path found for file "' + src + '".');
          }
        }

        grunt.log.writeln('Writing "' + src + '" data to "' + destinationFilename + '"');

        // Write the destination file.
        grunt.file.write(destinationFilename, jsModule);

        grunt.log.debug('Successfully created "' + destinationFilename + '".');
      });

    });
  });


  var utils = {
    // Given a file source, return an object of source parts
    extractFileInfo: function(src){
      var fileExtension = src.split('.').pop();
      var filename = src.split('/').pop().replace('.' + fileExtension, '');
      var filePath = src.replace('/' + filename + '.' + fileExtension, '');

      return{
        filename: filename,
        extension: fileExtension,
        path: filePath
      };
    }
  };

};


