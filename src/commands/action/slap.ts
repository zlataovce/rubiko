import { createAction } from "./";

const slap = createAction({
    name: "slap",
    description: "Slaps someone.",
    messages: {
        normal: "%user%, you have been slapped by %invoker%",
        lonely: "Hmm, why do you want this? Uh, I guess... *slaps you*",
        self: ":(",
    },
});

export default slap;
