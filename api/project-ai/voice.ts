import { handleProjectAi } from "../../src/server/project-ai-handler.js";

export default {
  fetch: (request: Request) => handleProjectAi("voice", request),
};
