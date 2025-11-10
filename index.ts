import { Elysia, t } from "elysia";

const app = new Elysia()
  .onBeforeHandle(({ headers, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader) {
      set.status = 401;
      return {
        error: "Missing Authorization header",
      };
    }

    const token = authHeader.replace("Bearer ", "");

    if (token !== process.env.API_TOKEN) {
      set.status = 401;
      return {
        error: "Invalid authorization token",
      };
    }
  })
  .post(
    "/evaluate",
    ({ body }) => {
      // For now, always return a score of 1 with a placeholder reason
      return {
        score: 1,
        reason: "Placeholder evaluation - all responses receive full marks",
      };
    },
    {
      body: t.Object({
        datapoint: t.Object({
          messages: t.Array(
            t.Object({
              role: t.String(),
              content: t.String(),
            }),
          ),
        }),
        prediction: t.String(),
        model_name: t.String(),
      }),
      response: t.Object({
        score: t.Number(),
        reason: t.String(),
      }),
    },
  )
  .listen(3001);

console.log(
  `🦊 Evaluation server is running at ${app.server?.hostname}:${app.server?.port}`,
);
