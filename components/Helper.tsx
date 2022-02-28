import { config } from './config'

export const getCurrentMember = async () => {
    try {
        const response = await fetch(config.server_url + '', {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    } catch (e) {
        console.log(e)
    }
}