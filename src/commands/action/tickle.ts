import { createAction } from "./";

const tickle = createAction({
    name: "tickle",
    description: "Tickles someone.",
    category: "tickle",
    messages: {
        normal: "%user%, you have been tickled by %invoker%",
        lonely: "*tickles you*",
        self: "hahahaha... oh god stop >u<",
    },
});

export default tickle;
