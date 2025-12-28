const run = async () => {
    try {
        const response = await fetch('https://valorant-api.com/v1/maps');
        const json = await response.json();
        const ascent = json.data.find((m: any) => m.displayName === 'Ascent');

        if (ascent) {
            console.log("Map: Ascent");
            console.log("Narrative Description:", ascent.narrativeDescription);
            console.log("Keys available:", Object.keys(ascent));
        } else {
            console.log("Ascent not found");
        }
    } catch (e) {
        console.error(e);
    }
};
run();
