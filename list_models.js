import 'dotenv/config';

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => {
                console.log(`- ${m.name.replace('models/', '')}`);
            });
        } else {
            console.error("Failed to list models:", data);
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
