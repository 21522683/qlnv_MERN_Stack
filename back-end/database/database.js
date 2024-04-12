import mongoose from "mongoose";
const connect = async () => {
    try {
        let connection = await mongoose.connect(process.env.MONGO_URI);
        return connection;
    } catch (error) {
        const {code} = error;
        if (code === 8000) {
            throw new Error("Wrong database's username and password");
        }
        else if (code === 'ENOTFOUND') {
            throw new Error('Wrong server name/connect string');
        }
        throw new Error('Cannot connect to mongoose')
    }
}


export default connect;