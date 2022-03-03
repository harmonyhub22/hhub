import Member from '../interfaces/models/Member';
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
        if (response.redirected) {
            console.log('response redirected');
            window.location.href = response.url;
        }
        const member: Member = await response.json();
        return member;
    } catch (e) {
        console.log(e)
    }
}