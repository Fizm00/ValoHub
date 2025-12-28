
const sync = async () => {
    try {
        console.log('Triggering Sync...');
        const response = await fetch('http://localhost:5000/api/sync', {
            method: 'POST'
        });
        const data = await response.json();
        console.log('Sync Result:', data);
    } catch (e) {
        console.error('Sync Failed:', e);
    }
};
sync();
