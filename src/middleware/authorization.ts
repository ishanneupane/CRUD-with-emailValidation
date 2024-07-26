import { AccessControl } from "accesscontrol";
import { Repository } from "typeorm";
import Permission from "../entity/permission";
const ac = new AccessControl();

export const loadPermissions = async (ctx: any) => {
  const data: Repository<Permission> = ctx.state.db.getRepository(Permission);
  const permissions = await data.find();
  const permissionPromises = permissions.map(async (party) => {
    return (ac.grant(party.role) as any)[party.action](party.resource);
  });

  const permission = await Promise.all(permissionPromises);

  console.log({ permission });

  return ac;
};

export { ac };

// ac.grant("user")
//   .readOwn("user")
//   .updateOwn("user")
//   .deleteOwn("user");
// ac.grant("admin")
//   .readAny("user")
//   .updateOwn("user")
//   .deleteOwn("user");
