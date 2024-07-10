import { createAction } from "./";

const peek = createAction({
    name: "peek",
    description: "Peeks at someone.",
    category: "lurk",
    messages: {
        normal: "%user%, you are being peeked at by %invoker%",
        lonely: "*peeks at you*",
        self: "Just lurking... nothing to see here...",
    },
});

export default peek;
