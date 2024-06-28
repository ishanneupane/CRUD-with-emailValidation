import app from "./app";
import dataconnection from "./databaseconnectiom/connection";

app.listen(8080, () => console.log("Server is running on port 8080"));

dataconnection
  .initialize()
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));
