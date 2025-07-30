import { app } from "./src/app";
import { dbConnection } from "./src/config/database";
import { connectRedis } from "./src/config/redis";
import { loadAllMongooseModels } from "./src/config/loadModels";

const PORT = 8000;

async function startServer() {
    const connectMongo = await dbConnection();

    connectMongo.on("error", (err) => {
        console.log("Erro ao se conectar na base de dados!", err);
    });

    connectMongo.once("open", () => {
        console.log("Conectado ao banco de dados MongoDB!");
        loadAllMongooseModels();
    });

    await connectRedis();
}

startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API OUVINDO NA PORTA ${PORT}`);
    });
});