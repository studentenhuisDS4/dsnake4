const Auth = {
    checkLoginStatus() :boolean {
        return checkAuthToken();
    },
    saveAuthToken(token: string) {
        localStorage.setItem('authToken', token);
    },
};

function checkAuthToken() :boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
}

export default Auth;