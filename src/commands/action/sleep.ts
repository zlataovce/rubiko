import { createAction } from "./";

const sleep = createAction({
    name: "sleep",
    description: "Puts someone to sleep.",
    messages: {
        normal: "Sweet dreams, %user%! - %invoker%",
        lonely: "*puts you to sleep*",
        self: "Zzz... time for a nap...",
    },
});

export default sleep;
