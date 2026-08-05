let statusEnabled = false;
const Status = {
    output: (msg) => {
        if (statusEnabled) {
            process.stdout.write(msg);
        }
    },
    error: (msg) => {
        if (statusEnabled) {
            process.stderr.write(msg);
        }
    },
    enable: () => {
        statusEnabled = true;
    },
    statusDisable: () => {
        statusEnabled = false;
    }
};
export { Status };
//# sourceMappingURL=status_output.js.map