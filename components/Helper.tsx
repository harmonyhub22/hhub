import { config } from './config'

export const ping = async () => {
    try {
        const response = await fetch(config.server_url + 'ping', {
            method: 'GET',
            headers: {
                credentials: 'include',
                'Content-Type': 'application/json'
            }
        });
        const jsonRepsonse = await response.json();
    } catch (e) {
        console.log(e);
    }
}

export const getCurrentMember = async () => {
    try {
        const response = await fetch(config.server_url + '')
        return response.json();
    } catch (e) {
        console.log(e)
    }
}