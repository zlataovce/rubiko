import { createAction } from "./";

const hug = createAction({
  name: "hug",
  description: "Hugs someone.",
  messages: {
    normal: [
      "%invoker% wraps their arms around %user% for a big warm hug 🤗",
      "%invoker% gives %user% a comforting hug 💞",
      "With a smile, %invoker% pulls %user% into a cozy hug 🫂",
      "%user% just got hugged by %invoker%! 🥺",
    ],
    lonely: "Aww, I see you are lonely, take a hug <3",
    self: "*blushes* o-oh... thanks you",
  },
});

export default hug;
