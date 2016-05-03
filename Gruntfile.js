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
      build: ['dist']
    },

    sass: {
      dist: {
        src: 'lib/styles/index.scss',
        dest: 'dist/styles/index.css'
      }
    },

    shell: {
      lint: {
        command: '$(npm bin)/eslint lib -f node_modules/eslint-html-reporter/reporter.js -o report.html'
      },
      mocha: {
        command: './node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha'
      },
      dist: {
        command: '$(npm bin)/babel lib --presets babel-preset-es2015 --plugins transform-react-jsx --out-dir dist'
      }
    },

    watch: {
      options: {
        spawn: true,
        livereload: true
      },
      js: {
        files: ['lib/**/*.js', 'lib/**/*.jsx'],
        tasks: ['shell:dist']
      },
      css: {
        files: ['lib/**/*.scss'],
        tasks: ['sass']
      }
    }

  });

  grunt.registerTask('build_local', ['clean', 'sass', 'shell:dist']);
  grunt.registerTask('default', ['clean', 'sass', 'watch']);
}
