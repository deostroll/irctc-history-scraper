var webpack = require('webpack');
var path = require('path');
module.exports = function(grunt) {
  grunt.initConfig({
    //begin - copy config
    copy: {
      build: {
        files: [
          {
            expand: true,
            src: ['./**/*.html', 'manifest.json', 'sidebar/foo.js', 'scripts/*.js'],
            dest: './dist',
            cwd: './src'
          }
        ]
      }
    },
    //end - copy config    
    clean: {
      build: {
        src: ['dist']
      }
    },

    watch: {
      webpack: {
        files: ['*.{js,scss}'],
        tasks: ['webpack', 'alert'],
        options: {
          cwd: './src/sidebar'
        }
      },
      static: {
        files: ['src/sidebar/*.html', 'src/manifest.json', 'src/scripts/*.js'],
        tasks: ['copy', 'alert']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('webpack', function() {
    var done = this.async();
    var config = {
      mode: 'development',
      entry: './src/sidebar/main.js',
      output: {
        path: path.resolve(path.join(__dirname, './dist/sidebar')),
        filename: 'main.js'
      },
      
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          },
          {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
          }
        ]        
      },
      devtool: 'inline'
    };

    webpack(config, (err, status) => {
      if(err) {
        grunt.log.error(err);
      }
      else {
        grunt.log.writeln(status);
        done();
      }
    });
  });

  grunt.registerTask('default', ['clean', 'webpack', 'copy']);

  grunt.registerTask('alert', () => {
    console.log('\007');
  });

  grunt.registerTask('build', ['webpack', 'copy'])
};