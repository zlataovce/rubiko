import { createAction } from "./";

const yeet = createAction({
  name: "yeet",
  description: "Throws someone.",
  messages: {
    normal: "*%invoker% yeets %user%*",
    lonely: "*yeets you*",
    self: "Wooosh! That was a close one!",
  },
});

export default yeet;
