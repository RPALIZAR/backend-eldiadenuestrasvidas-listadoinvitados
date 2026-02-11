const { app } = require('@azure/functions');
const { MongoClient } = require('mongodb');

let cachedClient = null;
async function getClient(uri) {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri, { tls: true, retryWrites: false });
    await client.connect();
    cachedClient = client;
    return client;
}

app.http('ListadoInvitados', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
            'Content-Type': 'application/json'
        };

        if (request.method === 'OPTIONS') return { status: 204, headers };

        // VALIDACIÓN
        const tokenRecibido = request.headers.get('x-admin-token');
        const tokenEsperado = process.env.ADMIN_TOKEN;

        if (!tokenRecibido || tokenRecibido !== tokenEsperado) {
            return { status: 401, headers, body: JSON.stringify({ error: 'Token inválido' }) };
        }

        try {
            const client = await getClient(process.env.COSMOS_MONGO_URI);
            const db = client.db(process.env.COSMOS_DB_NAME);
            const col = db.collection('rsvp');

            const invitados = await col.find({}).toArray();
            const invitadosOrdenados = invitados.sort((a, b) => {
                const dateA = a.updatedAt || 0;
                const dateB = b.updatedAt || 0;
                return new Date(dateB) - new Date(dateA);
            });

            const resumen = {
                totalRegistros: invitados.length,
                confirmados: invitados.filter(i => i.asistencia === true).length,
                cancelados: invitados.filter(i => i.asistencia === false).length,
                busIda: invitados.filter(i => i.asistencia && i.autobus).length
            };

            return { status: 200, headers, body: JSON.stringify({ resumen, invitados: invitadosOrdenados }) };
        } catch (err) {
            return { status: 500, headers, body: JSON.stringify({ error: err.message }) };
        }
    }
});