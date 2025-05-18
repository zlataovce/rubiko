import { createAction } from "./";

const pout = createAction({
  name: "pout",
  description: "Pouts at someone.",
  messages: {
    normal: "%invoker% is pouting at %user% *hmpf*",
    lonely: "*pouts, hmpf*",
    self: "Are you mad at me? :(",
  },
});

export default pout;
