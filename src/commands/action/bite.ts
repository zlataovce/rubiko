import { createAction } from "./";

const bite = createAction({
  name: "bite",
  description: "Bites someone.",
  messages: {
    normal: "%user%, you have been bitten by %invoker% :eyes:",
    lonely: "*bites you*",
    self: "T-That hurts!",
  },
});

export default bite;
