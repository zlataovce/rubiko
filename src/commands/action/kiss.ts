import { createAction } from "./";

const kiss = createAction({
  name: "kiss",
  description: "Kisses someone.",
  messages: {
    normal: [
      "%invoker% gives %user% a gentle kiss 😘",
      "%invoker% leans in and kisses %user%'s cheek 😘",
      "%invoker% plants a sweet kiss on %user% 💞",
    ],
    lonely: "Aww, I see you are lonely, *kisses*",
    self: "*blushes*... I- uh... don't think you should be kissing a bot but...",
  },
});

export default kiss;
