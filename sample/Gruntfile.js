module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var os = require('os');
  var ifaces = os.networkInterfaces();
  var lookupIpAddress = 'localhost';
  for (var dev in ifaces) {
    if (dev != "en1" && dev != "en0") {
      continue;
    }
    ifaces[dev].forEach(function(details) {
      if (details.family == 'IPv4') {
        lookupIpAddress = details.address;
      }
    });
  }
  console.log('Local IP address found as:' + lookupIpAddress);
  grunt.initConfig({

    uglify: {
      minify: {
        files: {
          'www/index.js': ['www/index.js']
        }
      }
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    clean: {
      build: ['www']
    },

    copy: {
      html: {
        src: 'app/index.html',
        dest: 'www/index.html'
      },
      svgLoaders: {
        src: 'app/images/svg_loaders/puff.svg',
        dest: 'www/svg_loaders/puff.svg',
        filter: 'isFile'
      },
      glyphicons: {
        expand: true,
        flatten: true,
        src: ['bower_components/bootstrap-sass-official/assets/fonts/bootstrap/**'],
        dest: 'www/fonts/bootstrap/',
        filter: 'isFile'
      },
      fonts: {
        expand: true,
        flatten: true,
        src: ['bower_components/font-awesome/fonts/**'],
        dest: 'www/fonts/',
        filter: 'isFile'
      }
    },

    sass: {
      dist: {
        src: 'app/styles/index.scss',
        dest: 'www/styles/index.css',
        options: {
          includePaths: ['bower_components']
        }
      }
    },

    browserify: {
      dist: {
        src: 'app/index.js',
        dest: 'www/index.js',
        options: {
          watch: true,
          transform: ['babelify', 'envify']
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8001,
          base: 'www'
        }
      }
    },
    env: {
      local: {
          API_CONTEXT_URI: "http:\\/\\/" + lookupIpAddress + ":4557"
      },
    },

    watch: {
      options: {
        spawn: true,
        livereload: true
      },
      js: {
        files: ['app/**/*.js', 'app/**/*.jsx'],
        tasks: ['browserify']
      },
      css: {
        files: ['app/**/*.scss'],
        tasks: ['sass']
      }
    }

  });

  grunt.registerTask('build_local', ['env:local', 'clean', 'bower', 'copy', 'sass', 'browserify']);
  grunt.registerTask('default', ['env:local','clean', 'bower', 'copy', 'sass', 'browserify', 'connect:server', 'watch']);

}
