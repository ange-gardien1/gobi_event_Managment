import { router } from "../../trpc";
import { getUsers } from "./getUsers";

export const usersRouter = router({
    getAllUsers : getUsers
})