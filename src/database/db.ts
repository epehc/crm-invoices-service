import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST!,
      dialect: "postgres",
      port: Number(process.env.DB_PORT),
    }
);

export default sequelize