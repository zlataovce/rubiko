import { createAction } from "./";

const cuddle = createAction({
  name: "cuddle",
  description: "Cuddles someone.",
  messages: {
    normal: "%invoker% is cuddling %user%",
    lonely: "*cuddles you*",
    self: "Awwiee, cute!",
  },
});

export default cuddle;
