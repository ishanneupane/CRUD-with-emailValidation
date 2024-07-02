
import app from "./app";
import { seedDatabase } from "./seeders/user-seeder";
import dataconnection from "./databaseconnection/data-source";

const PORT = 8080;


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await dataconnection.initialize();
    console.log("Connected to database");

    await seedDatabase();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});
