export function assert(cond: any, message?: string) {
    if (!cond) {
        if (!message) {
            throw Error("Assertion failed, condition is not 'true'");
        } else {
            throw Error("Assertion failed: " + message);
        }
    }
}