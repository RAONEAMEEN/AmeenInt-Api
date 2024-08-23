const express = require('express');
const axios = require('axios');
const app = express();

app.get('/insta', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 400, message: 'Instagram URL is required' });
    }

    try {
        // Prepare the URL for the saveinsta.io video downloader
        const downloadUrl = `https://saveinsta.io/video-downloader/`;
        
        // Submit the Instagram URL
        const response = await axios.post(downloadUrl, new URLSearchParams({ url }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Log the response data for debugging
        console.log(`Response Status: ${response.status}`);
        console.log(`Response Data: ${JSON.stringify(response.data)}`);

        if (response.status === 200) {
            // Assuming response data contains the download link
            const downloadPageUrl = response.data; // Adjust based on actual response structure

            // Fetch the actual download link from the download page
            const downloadResponse = await axios.get(downloadPageUrl);
            const mediaLink = extractMediaLinkFromPage(downloadResponse.data);

            res.json({ status: 200, media: [mediaLink] });
        } else {
            res.status(500).json({ status: 500, message: 'Failed to fetch media link' });
        }
    } catch (error) {
        console.error('Error fetching media link:', error.message);
        res.status(500).json({ status: 500, message: 'An error occurred', error: error.message || 'Unknown error' });
    }
});

// Function to extract media link from the download page (example placeholder)
function extractMediaLinkFromPage(html) {
    // Parse the HTML to find the media link. You might need a library like cheerio for this.
    // Example placeholder logic:
    const mediaLinkRegex = /href="([^"]+)"/;
    const match = html.match(mediaLinkRegex);
    return match ? match[1] : null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
