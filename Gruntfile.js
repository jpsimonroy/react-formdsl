module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

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

    sass: {
      dist: {
        src: 'lib/styles/index.scss',
        dest: 'www/styles/index.css'
      }
    },

    browserify: {
      dist: {
        src: 'lib/index.js',
        dest: 'www/index.js',
        options: {
          watch: true,
          transform: [["babelify", { "plugins": ["transform-react-jsx"] }]]
        }
      }
    },

    shell: {
      lint: {
        command: '$(npm bin)/eslint lib -f node_modules/eslint-html-reporter/reporter.js -o report.html'
      },
      mocha: {
        command: './node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha'
      }
    },

    watch: {
      options: {
        spawn: true,
        livereload: true
      },
      js: {
        files: ['lib/**/*.js', 'lib/**/*.jsx'],
        tasks: ['browserify']
      },
      css: {
        files: ['lib/**/*.scss'],
        tasks: ['sass']
      }
    }

  });

  grunt.registerTask('build_local', ['clean', 'sass', 'browserify']);
  grunt.registerTask('default', ['clean', 'sass', 'browserify', 'watch']);
}
