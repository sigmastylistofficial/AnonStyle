const express = require('express');
const router = express.Router();
const Look = require('../models/Look');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Helper: Check image safety with Gemini
async function checkImageSafety(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');

    const prompt = "Analyze this image for explicit adult content (nudity, pornography). Ignore fashion photography, swimwear, or text overlays unless they are explicitly pornographic. Answer ONLY with 'SAFE' or 'UNSAFE'.";
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg", // Assuming jpeg/png, Gemini handles standard types
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();
    
    console.log("Gemini Safety Check:", text);
    return text.includes("SAFE") && !text.includes("UNSAFE");
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback: If AI fails, allow it but log error (or block, depending on strictness. Let's allow to avoid blocking users on API errors)
    return true; 
  }
}

// Create a look (with multiple image uploads + AI Check)
router.post('/', [auth, upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'itemImages', maxCount: 10 }])], async (req, res) => {
  try {
    const files = req.files;
    let mainImageUrl = '';
    let mainImageLocalPath = '';

    // Process Main Image
    if (files['mainImage'] && files['mainImage'][0]) {
      mainImageLocalPath = files['mainImage'][0].path;
      mainImageUrl = `/uploads/${files['mainImage'][0].filename}`;
      
      // AI Safety Check
      const isSafe = await checkImageSafety(mainImageLocalPath);
      if (!isSafe) {
        // Delete the file
        fs.unlinkSync(mainImageLocalPath);
        return res.status(400).json({ msg: 'Image rejected by AI (NSFW detected).' });
      }
    } else if (req.body.mainImageUrl) {
        mainImageUrl = req.body.mainImageUrl;
    }

    if (!mainImageUrl) {
        return res.status(400).json({ msg: 'Main image is required' });
    }

    let links = [];
    if (req.body.links) {
        links = JSON.parse(req.body.links);
    }

    const itemImages = files['itemImages'] || [];

    const processedLinks = links.map(link => {
        let itemImageUrl = link.imageUrl || '';
        
        if (link.imageIndex !== undefined && link.imageIndex !== null && itemImages[link.imageIndex]) {
             itemImageUrl = `/uploads/${itemImages[link.imageIndex].filename}`;
        }
        
        return {
            title: link.title,
            url: link.url,
            imageUrl: itemImageUrl
        };
    });

    const newLook = new Look({
      user: req.user.id,
      imageUrl: mainImageUrl,
      title: req.body.title,
      links: processedLinks
    });

    const look = await newLook.save();
    res.json(look);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Feed (All looks, sorted by date, with optional search)
router.get('/feed', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      // Find users matching the query first
      const users = await User.find({ username: { $regex: q, $options: 'i' } });
      const userIds = users.map(user => user._id);

      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { user: { $in: userIds } }
        ]
      };
    }

    const looks = await Look.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'username profileUrl mainImage'); // Get creator info
    res.json(looks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Toggle Like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const look = await Look.findById(req.params.id);
    if (!look) return res.status(404).json({ msg: 'Look not found' });

    // Check if look has already been liked
    if (look.likes.includes(req.user.id)) {
      // Unlike
      look.likes = look.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      look.likes.push(req.user.id);
    }

    await look.save();
    res.json(look.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get looks by username (public profile)
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const looks = await Look.find({ user: user.id }).sort({ createdAt: -1 });
    res.json({ user, looks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single look by ID
router.get('/:id', async (req, res) => {
  try {
    const look = await Look.findById(req.params.id).populate('user', 'username mainImage');
    if (!look) return res.status(404).json({ msg: 'Look not found' });
    res.json(look);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Look not found' });
    res.status(500).send('Server Error');
  }
});

// Delete a look
router.delete('/:id', auth, async (req, res) => {
  try {
    const look = await Look.findById(req.params.id);
    if (!look) return res.status(404).json({ msg: 'Look not found' });

    if (look.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await look.deleteOne();
    res.json({ msg: 'Look removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
