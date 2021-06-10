module.exports = {
    port: process.env.PORT,
    files: ['./**/*.{html,htm,css,js}'],
    server:{
        baseDir: "./"
    },
    proxy : "https://blockchain-ari.herokuapp.com/"
};