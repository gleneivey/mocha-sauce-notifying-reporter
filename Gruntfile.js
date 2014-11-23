
function configureGrunt(grunt) {
  require("matchdep").filterDev(["grunt-*", "!grunt-cli"]).forEach(grunt.loadNpmTasks);

  grunt.registerTask(
      "default",
      "run coding standard checks by default",
      ["jshint", "jscs"]
  );

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: [ "*.js", "lib/**/*.js" ]
    },

    jscs: {
      all: ["*.js", "lib/**/*.js"]
    }
  });
}

// Export the configuration
module.exports = configureGrunt;
