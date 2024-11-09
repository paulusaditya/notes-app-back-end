const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0', // Dynamic host
        routes: {
            cors: {
                origin: ['*'], // Sesuaikan jika perlu, misal: ['http://example.com']
            },
        },
    });

    server.route(routes);

    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (err) {
        console.error('Gagal memulai server:', err);
        process.exit(1); // Keluar dengan kode error
    }
};

init();
