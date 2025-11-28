export default defineAppConfig({
    ui: {
        colors: {
            primary: 'violet',
            neutral: 'neutral'
        },

        formField: {
            slots: {
                container: "flex flex-col gap-2",
                help: "m-0",
            },
        },
        toaster: {
            slots: {
                viewport: "z-[10001]",
            },
        },
    }
})
