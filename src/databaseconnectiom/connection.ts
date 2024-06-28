require("dotenv").config();
import "reflect-metadata";
import { join } from "path";
const parentDir = join(__dirname, "..");
import { DataSource, DataSourceOptions } from "typeorm";

const connectionOptions: DataSourceOptions = {
  host: process.env.DB_HOST,
  type:"postgres",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    join(parentDir, "entity", "*.ts"),
    join(parentDir, "entity", "*.js"),
  ],
};
const connection = new DataSource(connectionOptions);
export default connection;
