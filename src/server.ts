import app from ".";
import { seedDatabase } from "./seeders/user-seeder";
import dataconnection from "./data-source";
import { seedPermission } from "./seeders/role-permission-seeders";
import { seedRole } from "./seeders/role-seeder";
const PORT = 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await dataconnection.initialize();
    console.log("Connected to database");

    await seedDatabase();
    await seedPermission();
    await seedRole();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});
