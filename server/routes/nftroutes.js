const express = require('express');
const router = express.Router();
const NFT = require('../models/nftschema');

//create nft
router.post('/create', async (req, res) => {
  try {
    const { nftId, nftcode } = req.body;
    await NFT.create({ nftId:nftId, nftcode:nftcode });
  }catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

//likeNFT
router.post('/like', async (req, res) => {
  try {
    const { nftId, user } = req.body;

    const nft = await NFT.findOneAndUpdate(
      { nftId },
      { $setOnInsert: { likes: 0, likesList: [] } }, 
      { new: true, upsert: true }
    );

    const alreadyLiked = nft.likesList.includes(user);
    if (alreadyLiked) {
      nft.likes -= 1;
      nft.likesList = nft.likesList.filter((u) => u !== user);
    } else {
      nft.likes += 1;
      nft.likesList.push(user);
    }

    await nft.save();
    res.json({ likes: nft.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//comment
router.post('/comment', async (req, res) => {
  try {
    const { nftId, user, text } = req.body;
    const nft = await NFT.findOneAndUpdate(
      { nftId },
      { $push: { comments: { user, text } } },
      { new: true, upsert: true }
    );
    nft.comments = nft.comments || [];
    res.json(nft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GetNFTDetails 
router.post('/getnft', async (req, res) => {
  try {
    const { nftId } = req.body;
    const nft = await NFT.findOne({ nftId });
    if (!nft) {
      return res.status(404).json({ error: "NFT not found" });
    }
    res.json(nft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
