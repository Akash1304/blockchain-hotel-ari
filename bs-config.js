module.exports = {
    port: process.env.PORT,
    files: ['.src/**/*.{html,htm,css,js}'],
    server:{
        baseDir: ["./src", "./build/contracts"]
    },
    routes:{
        "/vendor" : "./node_modules"
    }
};