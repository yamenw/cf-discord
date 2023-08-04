import { serve } from "http"
import { resolveREST } from "../../../src/api/index.ts";

serve(async (req) => {
  return await resolveREST(req);
})

