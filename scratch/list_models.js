const https = require('https');

const key = "AIzaSyCvAN6B00yRXXZHEUrO26Q7Y_VVYWPzQHA";
console.log("Checking API Key:", key.substring(0, 10) + "...");

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Available Models:");
      if (parsed.models) {
        parsed.models.forEach((m) => {
          console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(", ")})`);
        });
      } else {
        console.log("No models returned. Response:", JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log("Raw Response:", data);
    }
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});
