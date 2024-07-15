import { AccessControl } from "accesscontrol";

const ac = new AccessControl();

ac.grant("admin")
  .updateAny("user")
  .deleteAny("user")
  .createAny("user")
  .readAny("user");

ac.grant("user")
  .readOwn("user")
  .updateOwn("user")
  .deleteOwn("user");


export const accessControl = ac;
