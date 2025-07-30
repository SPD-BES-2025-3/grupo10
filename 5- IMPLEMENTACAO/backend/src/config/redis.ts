import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Erro no Cliente Redis:', err));

// Função para conectar ao Redis
async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Conectado ao Redis com sucesso!');
    } catch (err) {
        console.error('Falha ao conectar com o Redis:', err);
    }
}

export { redisClient, connectRedis };
