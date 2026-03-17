import { Mastra } from "mastra";

import { shinodaAgent } from "../shinoda/agent";

export const mastra = new Mastra({
  agents: {
    shinoda: shinodaAgent,
  },
});