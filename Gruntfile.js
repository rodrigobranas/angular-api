module.exports = function (grunt) {

  grunt.initConfig({
    clean: {
      dist: ['dist/']
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        unused: false,
        boss: true,
        eqnull: false,
        browser: true,
        noempty: true,
        trailing: true,
        globals: {
          jQuery: true
        }
      },
      dist: ['js/*.js']
    },
    concat: {
      dist: {
        src: ['src/api.js', 'src/angular-api.js'],
        dest: 'dist/angular-api.js'
      }
    },
    uglify: {
      dist: {
        src: ['dist/angular-api.js'],
        dest: 'dist/angular-api.min.js'
      }
    },
    karma: {
      dist: {
        configFile: 'karma.conf.js',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('dist',  ['clean', 'jshint', 'concat', 'uglify']);
}