
export const ping = async () => {
    try {
        const response = await fetch('http://localhost:5000/ping', {
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