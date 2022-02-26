import { config } from './config'

export const ping = async () => {
    try {
        const response = await fetch(config.server_url + '/ping', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jsonRepsonse = await response.json();
    } catch (e) {
        console.log(e);
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await fetch(config.server_url + '/')
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (e) {
        console.log(e)
    }
}