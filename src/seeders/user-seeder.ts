import "reflect-metadata";
import { Admin, Repository } from "typeorm";
import User from "../entity/user";
import connection from "../data-source";
export const seedDatabase = async () => {   
  try {
    const data: Repository<User> = await connection.getRepository(User);
    const usersToCreate = {
      name: "ram",
      email: "ram@example.com",
      password: "ram",
      role:"admin"

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
