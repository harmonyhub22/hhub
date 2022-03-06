import Member from '../interfaces/models/Member';
import { config } from './config'

export const getCurrentMember = async () => {
    try {
        const response = await fetch(config.server_url + 'api/', {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.status === 302) {
            console.log('response redirected');
            window.location.href = (await response.json()).url;
        }
        const member: Member = await response.json();
        return member;
    } catch (e) {
        console.log(e)
    }
}