<!DOCTYPE html>
<html>
<head>
<title>Climate Change Word Cloud</title>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-cloud@1.2.5/build/d3.layout.cloud.min.js"></script>
<style>
body {
    font-family: sans-serif;
}
#wordCloud {
    width: 800px;
    height: 400px;
    border: 1px solid #ccc;
    margin: 20px auto;
}
#loadingMessage {
    text-align: center;
    font-size: 18px;
    margin-top: 20px;
    display: none;
}
#resultImage {
    max-width: 512px;
    max-height: 512px;
    display: none;
    margin: 20px auto;
}
</style>
</head>
<body>
<h1>Climate Change Challenges</h1>
<select id="citySelect">
    <option value="">Select a City</option>
    <option value="new-york">New York</option>
    <option value="london">London</option>
    <option value="tokyo">Tokyo</option>
    <option value="mumbai">Mumbai</option>
    <option value="sydney">Sydney</option>
</select>
<div id="wordCloud"></div>
<div id="loadingMessage">Generating image...</div>
<img id="resultImage" src="/placeholder.svg" alt="Generated Image">
<button id="downloadBtn" style="display: none;">Download Image</button>

<script>
const cityData = {
    'new-york': ['Sea Level Rise', 'Heat Waves', 'Flooding', 'Air Pollution', 'Urban Heat Island'],
    'london': ['Flooding', 'Air Quality', 'Urban Heat', 'Water Scarcity', 'Biodiversity Loss'],
    'tokyo': ['Typhoons', 'Urban Heat', 'Sea Level Rise', 'Air Pollution', 'Flooding'],
    'mumbai': ['Monsoon Flooding', 'Sea Level Rise', 'Air Pollution', 'Water Scarcity', 'Heat Waves'],
    'sydney': ['Bushfires', 'Drought', 'Coastal Erosion', 'Heat Waves', 'Biodiversity Loss']
};

// Word cloud setup
function createWordCloud(words) {
    const width = document.getElementById('wordCloud').offsetWidth;
    const height = 300;

    // Clear previous word cloud
    d3.select("#wordCloud").selectAll("*").remove();

    const svg = d3.select("#wordCloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map(d => ({ text: d, size: 20 + Math.random() * 30 })))
        .padding(10)
        .rotate(() => 0)
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", `translate(${width/2},${height/2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => `hsl(${Math.random() * 360}, 70%, 50%)`)
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .text(d => d.text)
            .style("cursor", "pointer")
            .on("click", handleWordClick);
    }
}

// Handle city selection
document.getElementById('citySelect').addEventListener('change', (e) => {
    const city = e.target.value;
    if (city && cityData[city]) {
        createWordCloud(cityData[city]);
    }
});

// Handle word click and image generation
async function handleWordClick(event, d) {
    const city = document.getElementById('citySelect').value;
    const challenge = d.text;
    
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('resultImage').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';

    try {
        // Using Stable Diffusion API (you'll need to sign up for an API key)
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'sk-HFQ5mF7E1bDIvoIIKo3wdnUE8ZnYPJKcCM4Kpldgw21hye00'
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: `${city} city facing ${challenge.toLowerCase()} climate challenge, digital art style`
                    }
                ],
                cfg_scale: 7,
                height: 512,
                width: 512,
                samples: 1
            })
        });

        const data = await response.json();
        const imageUrl = data.artifacts[0].base64; // Assuming the API returns base64 image

        document.getElementById('resultImage').src = `data:image/png;base64,${imageUrl}`;
        document.getElementById('resultImage').style.display = 'block';
        document.getElementById('downloadBtn').style.display = 'block';
        document.getElementById('loadingMessage').style.display = 'none';
    } catch (error) {
        console.error('Error generating image:', error);
        document.getElementById('loadingMessage').textContent = 'Error generating image. Please try again.';
    }
}

// Handle image download
document.getElementById('downloadBtn').addEventListener('click', () => {
    const image = document.getElementById('resultImage');
    const link = document.createElement('a');
    link.download = 'climate-challenge.png';
    link.href = image.src;
    link.click();
});
</script>

</body>
</html>
