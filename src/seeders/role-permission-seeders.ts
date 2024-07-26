import connection from "../data-source";
import "reflect-metadata";
import { Repository } from "typeorm";
import Permission from "../entity/permission";

export const seedPermission = async () => {
  try {
    const data: Repository<Permission> = connection.getRepository(Permission);
    const permissionsToCreate = [
      { resource: "user", action: "createAny", role: "admin" },
      { resource: "user", action: "readAny", role: "admin" },
      { resource: "user", action: "updateAny", role: "admin" },
      { resource: "user", action: "delete", role: "admin" },
      { resource: "user", action: "createOwn", role: "user" },
      { resource: "user", action: "readOwn", role: "user" },
      { resource: "user", action: "updateOwn", role: "user" },
      { resource: "user", action: "deleteOwn", role: "user" },
    ];
    const existingPermission = await data.findOne({
      where: { resource: permissionsToCreate[0].resource },
    });
    if (!existingPermission) {
      await data.save(permissionsToCreate);
      console.log("Permissions seeded");
    } else {
      console.log("Permissions already seeded");
    }
  } catch (error) {
    console.log(error);
  }
};
