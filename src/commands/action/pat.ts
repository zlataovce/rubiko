import { createAction } from "./";

const pat = createAction({
  name: "pat",
  description: "Pats someone.",
  messages: {
    normal: [
      "%invoker% gently pats %user%'s head ✨",
      "%invoker% gives %user% a few soft headpats 🥺",
      "Pat pat~ %invoker% shows affection to %user% 🤍",
      "%invoker% reaches over and pats %user% gently 😊",
    ],
    lonely: "Aww, I see you are lonely, take a pat <3",
    self: "*is patted*",
  },
});

export default pat;
