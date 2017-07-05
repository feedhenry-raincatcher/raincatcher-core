module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['src/**/*.ts'],
                tasks: ['exec:run'],
                options: {
                    livereload: true,
                    atBegin: true
                },
            },
        },
        exec: {
            'run': 'ts-node src/index.ts',
            'test': 'npm run test'
        },
        env: {
            options: {},
            // environment variables.
            local: {
                NODE_ENV: "development",
                PORT: 8001
            }
        },
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('serve', ['env:local', 'watch']);
    grunt.registerTask('test', ['env:local', 'exec:test']);
    grunt.registerTask('default', ['serve']);
};
