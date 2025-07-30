import { createClient } from 'redis';

const CHANNEL = 'crud-channel';

async function startListener() {
    // É uma boa prática usar um cliente separado para subscrições
    const subscriber = createClient({
        url: 'redis://localhost:6379'
    });

    subscriber.on('error', (err) => console.error('❌ Erro no Ouvinte Redis:', err));

    await subscriber.connect();
    console.log('🟢 Ouvinte conectado ao Redis.');
    console.log(`🎧 Escutando o canal [${CHANNEL}]...`);

    // Se inscreve no canal para receber mensagens
    await subscriber.subscribe(CHANNEL, (message, channel) => {
        console.log(`\n🔔 Mensagem recebida do canal [${channel}]:`);
        try {
            // Formata o JSON para uma leitura mais fácil
            const parsedMessage = JSON.parse(message);
            console.log(JSON.stringify(parsedMessage, null, 2));
        } catch {
            console.log(message); // Se não for JSON, apenas imprime a mensagem
        }
        console.log('--------------------------------------------------');
    });
}

startListener();
