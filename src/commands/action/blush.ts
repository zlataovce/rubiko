import { createAction } from "./";

const blush = createAction({
  name: "blush",
  description: "Blushes at someone.",
  messages: {
    normal: "%invoker% is blushing at %user%",
    lonely: "*blushes at you*",
    self: ";////;",
  },
});

export default blush;
