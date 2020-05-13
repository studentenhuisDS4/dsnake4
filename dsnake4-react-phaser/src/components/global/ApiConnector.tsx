import axios from "axios/index";
import env from "src/config/env.json";
import Auth from "src/components/auth/Auth";

type apiMethod = 'delete' | 'get' | 'patch' | 'post' | 'put';
interface axiosParams {
    apiUrl: string,
    options: axiosConfig,
    data?: {},
}
interface axiosConfig {
    headers: {
        Authorization?: string,
    }
}

const ApiConnector = {
    connect(method: apiMethod, apiUrlPath: string, authenticate?: boolean, data?: {}) {
        authenticate = authenticate === undefined;
        return new Promise((resolve, reject) => {
            const baseUrl = getApiBaseUrl();
            if (baseUrl) {
                env.environment === 'development' && console.log('api ' + method, baseUrl + apiUrlPath);
                const apiUrl = baseUrl + apiUrlPath;
                const options: axiosConfig = getApiHeaders(apiUrl, authenticate);
                const params: axiosParams = {
                    apiUrl,
                    data,
                    options,
                };

                const apiMethod = getApiMethod(method, params);
                apiMethod()
                    .then((result: any) => {
                        if (result.status >= 200 && result.status < 300) {
                            resolve(result.data);
                        } else {
                            throw new Error();
                        }
                    })
                    .catch(error => {
                        // Api returned an error
                        const errorCode = handleApiErrors(error);
                        const context = {errorCode: errorCode, data: error};
                        reject(context);
                    });
            } else {
                reject('No api base url');
            }
        });
    },
};

function getApiBaseUrl() {
    let baseUrl = env.apiBaseUrl;
    if (baseUrl === undefined) {
        return false;
    } else {
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        return baseUrl;
    }
}

function getApiHeaders(apiUrl: string, authenticate?: boolean) :axiosConfig {
    const authToken = Auth.getAuthToken();
    const options :axiosConfig = { headers: {} };
    if (authenticate) {
        options.headers.Authorization = 'Bearer '.concat(authToken);
    }
    return options;
}

function getApiMethod(method: string, params: axiosParams) {
    let axiosMethod;
    switch (method) {
        case 'delete':
            axiosMethod = () => axios.delete(params.apiUrl, params.options);
            break;
        case 'get':
        default:
            axiosMethod = () => axios.get(params.apiUrl, params.options);
            break;
        case 'patch':
            axiosMethod = () => axios.patch(params.apiUrl, params.data, params.options);
            break;
        case 'post':
            axiosMethod = () => axios.post(params.apiUrl, params.data, params.options);
            break;
        case 'put':
            axiosMethod = () => axios.put(params.apiUrl, params.data, params.options);
            break;
    }
    return axiosMethod;
}

function handleApiErrors(error: any, comment?: string) {
    let errorCode;

    if (comment === undefined) {
        comment = '';
    }

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // env.environment === constants.environment.development && console.log('data:', error.response.data);
        // env.environment === constants.environment.development && console.log('status:', error.response.status);
        // env.environment === constants.environment.development && console.log('headers:', error.response.headers);

        notifyOnError(error.response.status, false, comment);
        errorCode = error.response.status;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // env.environment === constants.environment.development && console.log('request:', error.request);

        errorCode = 1000;
        notifyOnError('1000', true, error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        // env.environment === constants.environment.development && console.log('Error message:', error.message);

        errorCode = 1001;
        notifyOnError('1001', true, error.message);
    }

    return errorCode;
}

function notifyOnError(statusCode: string, showUserMessage: boolean, additionalInfo: any) {
    let userMessage: string;
    let consoleMessage: string;
    switch (statusCode) {
        case '400':
            userMessage = '';
            consoleMessage = 'Data not valid';
            break;
        case '401':
            userMessage = '';
            consoleMessage = 'Invalid credentials';
            break;
        case '403':
            userMessage = '';
            consoleMessage = 'Access denied';
            break;
        case '1000':
            userMessage = 'applicationUnavailable';
            consoleMessage = 'API not reachable';
            break;
        case '1001':
            userMessage = 'applicationUnavailable';
            consoleMessage = 'API request error';
            break;
        default:
            userMessage = '';
            consoleMessage = 'Unknown API error';
            break;
    }

    if (showUserMessage) {
        console.log(userMessage);
    }

    if (env.environment === 'development') {
        console.log(consoleMessage);
        if (additionalInfo) {
            console.log('additional info: ', additionalInfo);
        }
    }
}

export default ApiConnector;