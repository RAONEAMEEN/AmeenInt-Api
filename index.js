const express = require('express');
const axios = require('axios');
const app = express();

app.get('/insta', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 400, message: 'Instagram URL is required' });
    }

    try {
        // Encode the Instagram URL for use in the saveinsta.io link
        const encodedUrl = encodeURIComponent(url);
        const saveInstaUrl = `https://saveinsta.io/dl.php?url=${encodedUrl}`;

        // Make a request to saveinsta.io to get the media link
        const response = await axios.get(saveInstaUrl);

        // If successful, return the media link in the same format as your friend's API
        if (response.status === 200) {
            res.json({ status: 200, media: [saveInstaUrl] });
        } else {
            res.status(500).json({ status: 500, message: 'Failed to fetch media link' });
        }
    } catch (error) {
        console.error('Error fetching media link:', error.message);
        res.status(500).json({ status: 500, message: 'An error occurred', error: error.message || 'Unknown error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
