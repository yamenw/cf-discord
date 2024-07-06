import { serve } from "http";
import { resolveREST } from "../_shared/api/index.ts";


serve(async (req) => {
  return await resolveREST(req);
})

