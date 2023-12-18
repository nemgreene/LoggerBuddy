const express = require("express");
const Stream = require("./models/StreamV2");
const Post = require("./models/Post");
require("dotenv").config();
const User = require("./models/User");
const { uuid } = require("uuidv4");
const { ObjectId, StreamDescription } = require("mongodb");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/posts/update", async (req, res) => {
  const post = { ...req.body };
  try {
    if (post.oldStream !== post.streamId) {
      // streams must both be updated to reflect the reparenting of post
      await Promise.all(
        [post.oldStream, post.streamId].map(async (_id, i) => {
          const prev = await Stream.findOne({
            _id: i === 0 ? post.oldStream : post.streamId,
          });

          if (i === 0) {
            // old stream, filter and save
            await Stream.findOneAndUpdate(
              { _id },
              { posts: prev.posts.filter((v) => v != post._id) }
            );
          } else {
            await Stream.findOneAndUpdate(
              { _id },
              { posts: [...prev.posts, post._id] }
            );

            //new stream, append and save
          }
        })
      );
    }
    await Post.findOneAndUpdate({ _id: post._id }, post);
    res.status(200).send();
  } catch (e) {
    res.status(400).send({ error: "Unable to edit post" });
  }
});

router.post("/streams/update", async (req, res) => {
  try {
    const { streamDescription, dateCreated, links, streamId, tags, ...rest } =
      req.body;
    if (!streamDescription || !dateCreated || !links) {
      throw new Error("Missing Required Fields");
    }
    let stringLinks = links.map((link) => JSON.stringify(link));

    console.log(tags);
    const ret = await Stream.findOneAndUpdate(
      { _id: streamId },
      { streamDescription, dateCreated, tags, links: stringLinks }
    );
    res.status(200).send("Stream Updated");
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message || "Error Updating Post" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let ret = await Stream.updateMany(
      {},
      { $pull: { posts: new mongoose.Types.ObjectId(id) } },
      { new: true }
    );

    // const bs = await Stream.findOne({ streamName: "Base Scripter" });
    // let posts = [...bs.posts];

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error Deleting post..." });
  }
});

module.exports = router;
