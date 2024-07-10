import { createAction } from "./";

const punch = createAction({
    name: "punch",
    description: "Punches someone.",
    messages: {
        normal: "%user%, you have been punched by %invoker%",
        lonely: "If you want that... *punches you*",
        self: "Ouch! That must have hurt!",
    },
});

export default punch;
