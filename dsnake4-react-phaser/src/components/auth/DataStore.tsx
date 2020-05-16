export const NicknameStorageKey = 'nickname';

const DataStore = {
    storeNickname(nickname: string): Promise<boolean> {
        saveNickname(nickname);
        return Promise.resolve(true);
    },
    checkNicknameSet(): boolean {
        return !!this.getNickname();
    },
    getNickname(): string {
        const nickname = localStorage.getItem(NicknameStorageKey);
        if (nickname) {
            return nickname;
        } else {
            return '';
        }
    },
};

function saveNickname(nickname: string) {
    localStorage.setItem(NicknameStorageKey, nickname);
}

export default DataStore;