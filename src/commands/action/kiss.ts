import { createAction } from "./";

const kiss = createAction({
    name: "kiss",
    description: "Kisses someone.",
    category: "kiss",
    messages: {
        normal: "%user%, you have been kissed by %invoker%",
        lonely: "Aww, I see you are lonely, *kisses*",
        self: "*blushes*... I- uh... don't think you should be kissing a bot but...",
    },
});

export default kiss;
