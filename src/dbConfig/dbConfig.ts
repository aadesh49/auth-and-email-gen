import mongoose from 'mongoose';

export async function ConnectDb() {
    try {
        mongoose.connect(process.env.MONGODB_URL!)                 //'!' is used to ensure that the variable will be string type only

        const conn = mongoose.connection;
        conn.on("connected", () => {                            //a listener function, runs only when the  Db is connected
            console.log("MongoDB connected successfully");
        })

        conn.on("error", (e) => {
            console.log("MongoDb connection error, please make sure that db is up and running: " + e);
            process.exit();
        })
    } catch (error) {
        console.log("Connection went wrong: " + error);
    }
}

