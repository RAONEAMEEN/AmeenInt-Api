const express = require('express');
const axios = require('axios');
const app = express();

app.get('/insta', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 400, message: 'Instagram URL is required' });
    }

    try {
        const saveInstaResponse = await axios.get(`https://saveinsta.io/api/ajaxSearch.php`, {
            params: {
                q: url
            }
        });

        const media = saveInstaResponse.data.data.media;

        if (media && media.length > 0) {
            res.json({ status: 200, media });
        } else {
            res.status(500).json({ status: 500, message: 'Failed to fetch media link' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: 'An error occurred', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
