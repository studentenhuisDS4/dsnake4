import env from '../../config/env.json';
import env_prod from '../../config/env.prod.json';

export function getEnvironment() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return env;
    } else if (process.env.NODE_ENV === 'production') {
        return env_prod;
    } else {
        return env;
    }
}

export const Configuration = getEnvironment();
