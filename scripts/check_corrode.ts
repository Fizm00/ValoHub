const checkApi = async () => {
    try {
        console.log("Fetching maps from https://valorant-api.com/v1/maps...");
        const res = await fetch('https://valorant-api.com/v1/maps');
        const data = await res.json();

        const corrode = data.data.find((m: any) => m.displayName.toLowerCase() === 'corrode');

        if (corrode) {
            console.log("✅ FOUND CORRODE via API!");
            console.log(JSON.stringify(corrode, null, 2));
        } else {
            console.log("❌ 'Corrode' NOT found in official API.");
            console.log(`Total Maps Found: ${data.data.length}`);
            console.log("Maps List:", data.data.map((m: any) => m.displayName).join(", "));
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

checkApi();
