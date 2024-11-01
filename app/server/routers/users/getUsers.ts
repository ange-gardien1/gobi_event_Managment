import { db } from "@/app/db";
import { protectedProcedure } from "../../trpc";
import { users } from "@/app/db/schema";


export const getUsers = protectedProcedure.query(async () => {
    const Users = await db.select({
      id: users.id,
      username: users.name, 
    }).from(users);
  
    return Users; 
});
