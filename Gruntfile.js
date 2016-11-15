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
    }

  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-modernizr');

  grunt.registerTask('default', ['modernizr:dist', 'nodemon']); 

};