import "reflect-metadata";
import { Repository } from "typeorm";
import User from "../entity/user";
import connection from "../data-source";
export const seedDatabase = async () => {   
  try {
    const data: Repository<User> = await connection.getRepository(User);
    const usersToCreate = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    };
    const existingUser = await data.findOne({
      where: { email: usersToCreate.email },
    });
    if (!existingUser) {
      await data.save(usersToCreate);
      console.log("Database seeded");
    } else {
      console.log("Database already seeded");
    }
  } catch (error) {
    console.log(error);
  }
};
