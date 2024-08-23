const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const app = express();

app.use(express.json());

app.get('/insta', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 400, message: 'Instagram URL is required' });
    }

    try {
        const form = new FormData();
        form.append('url', url);

        const response = await axios.post('https://instagram-video-or-images-downloader.p.rapidapi.com/', form, {
            headers: {
                ...form.getHeaders(),
                'x-rapidapi-host': 'instagram-video-or-images-downloader.p.rapidapi.com',
                'x-rapidapi-key': '39ce9b146amshe05750fd94b0194p1f30fejsn181801eeeb08'
            }
        });

        console.log(`Response Status: ${response.status}`);
        console.log(`Response Data: ${JSON.stringify(response.data)}`);

        if (response.status === 200) {
            const mediaLinks = response.data; // Adjust based on the actual response structure
            res.json({ status: 200, media: mediaLinks });
        } else {
            res.status(500).json({ status: 500, message: 'Unexpected response from API' });
        }
    } catch (error) {
        console.error('Error fetching media link:', error.response ? error.response.data : error.message);
        res.status(500).json({
            status: 500,
            message: 'An error occurred',
            error: error.response ? error.response.data : error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
