// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

    // configure nodemon
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    // configure modernizr
    modernizr: {
      dist: {
        "crawl": false,
        "customTests": [],
        "dest": "./bin/modernizr.js",
        "tests": [
          "touchevents"
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    },

    // uglify
    uglify: {
      my_target: {
        options: {
          mangle: false,
          beautify: true
        },
        files: [{
          src: '*/**.js',
          dest: 'dist/js',
          cwd: 'public/src/js',
          expand: true,
          ext: '.min.js',
        },
        {
          src: '*.js',
          dest: 'dist/js',
          cwd: 'public/src/js',
          expand: true,
          ext: '.min.js'
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify', 'modernizr:dist', 'nodemon']); 

};