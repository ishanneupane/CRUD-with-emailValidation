import connection from "../data-source";
import "reflect-metadata";
import { Repository } from "typeorm";
import Role from "../entity/role";

export const seedRole = async () => {
try {

    const data: Repository<Role> =connection.getRepository(Role);
    const RolesToCreate = [{key:"admin",name:"Admin"},{key:"user",name:"User"}]
        
    const existingRole = await data.findOne({
    where: { key: RolesToCreate[0].key,},
  });
  if (!existingRole) {
    await data.save(RolesToCreate);
    console.log("Roles seeded");
  } else {
    console.log("Roles already seeded");
  }
    
} catch (error) { console.log(error);}
    
}

