import { TRPCError, initTRPC } from "@trpc/server";
import { context } from "../api/trpc/context";

const t = initTRPC.context<context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  if (!opts.ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return opts.next({});
});
