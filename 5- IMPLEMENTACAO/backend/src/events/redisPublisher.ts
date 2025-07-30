import { redisClient } from '../config/redis';
import { CrudOperation } from './crudOP';

const CHANNEL = 'crud-channel';

class RedisPublisher {
    public async publishOperation(op: Omit<CrudOperation, 'timestamp' | 'source' | 'data'> & { data: object }) {
        if (!redisClient.isOpen) {
            console.error('A conexão com o Redis não está aberta. Não foi possível publicar a mensagem.');
            return;
        }

        try {
            const crudOperation: CrudOperation = {
                ...op,
                source: 'ODM',
                data: JSON.stringify(op.data),
                timestamp: new Date().toISOString()
            };

            const message = JSON.stringify(crudOperation);
            await redisClient.publish(CHANNEL, message);
            console.log(`Mensagem publicada no canal [${CHANNEL}]:`, message);
        } catch (error) {
            console.error('Erro ao publicar operação no Redis:', error);
        }
    }
}

export default new RedisPublisher();
