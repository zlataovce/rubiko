import { createAction } from "./";

const hug = createAction({
    name: "hug",
    description: "Hugs someone.",
    category: "hug",
    messages: {
        normal: "%user% you have been hugged by %invoker%",
        lonely: "Aww, I see you are lonely, take a hug <3",
        self: "*blushes* o-oh... thanks you",
    },
});

export default hug;
