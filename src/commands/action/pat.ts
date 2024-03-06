import { createAction } from "./";

const pat = createAction({
    name: "pat",
    description: "Pats someone.",
    messages: {
        normal: "%user%, you have been patted by %invoker%",
        lonely: "Aww, I see you are lonely, take a pat <3",
        self: "*is patted*",
    },
});

export default pat;
