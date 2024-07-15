import "reflect-metadata";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();
const parentDir = join(__dirname, "..");

const connectionOptions: DataSourceOptions = {
  host: process.env.DB_HOST,
  type: "postgres",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize:true,
  logging: false,
  entities: [
    join(parentDir, "src","entity", "*.ts"),
    join(parentDir, "entity", "*.js"),
  ],
  migrations: ["src/migration/**/*.ts"],
  
 };
const connection = new DataSource(connectionOptions);
export default connection;
