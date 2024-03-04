import { createAction } from "./";

const poke = createAction({
    name: "poke",
    description: "Pokes someone.",
    category: "poke",
    messages: {
        normal: "%user%, you have been poked by %invoker% :eyes:",
        lonely: "Aww, I see you are lonely, *pokes you*",
        self: "O-Oh! What do you need?",
    },
});

export default poke;
