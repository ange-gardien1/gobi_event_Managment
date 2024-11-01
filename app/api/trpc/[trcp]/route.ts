
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "../context";
import { appRouter } from "@/app/server";


const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createContext(opts),
  });
export { handler as GET, handler as POST };
