const HelperFunctions = {
    generateRandomId() :number {
        return Math.floor(Math.random() * 999999999) + 1;
    },
    generateUUID() :string {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
};

export default HelperFunctions;