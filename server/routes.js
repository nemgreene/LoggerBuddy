const express = require("express");
// const Stream = require("./models/Stream");
const Stream = require("./models/StreamV2");
const Post = require("./models/Post");
require("dotenv").config();
const User = require("./models/User");
const { uuid } = require("uuidv4");
const mongoose = require("mongoose");

const router = express.Router();

//get stream headers
router.get("/streams/headers", async (req, res, next) => {
  try {
    const streams = await Stream.find({});
    // const output = streams.map(({ posts, ...rest }) => rest);
    let ret = streams.map((o) => {
      const { posts, _id, links, ...rest } = o.toObject();
      let stringLinks = links.map((link) => JSON.parse(link));
      return {
        ...rest,
        links: stringLinks,
        streamId: o._id,
        posts: posts.length,
      };
    });
    res.send(ret);
    return;
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

//get posts and stream headers by tag/filter
router.post("/posts/tagged", async (req, res, next) => {
  try {
    let { tags, page, trackedStream } = req.body;

    page -= 1;

    const streamFilter =
      trackedStream.length > 0
        ? {
            $or: trackedStream.map((_id) => ({
              _id: new mongoose.Types.ObjectId(_id),
            })),
          }
        : {};

    const taggedFilter =
      tags.length > 0
        ? {
            $or: tags.map((tags) => ({ tags })),
          }
        : {};

    const taggedStreams = await Stream.aggregate([
      {
        $match: {
          $and: [taggedFilter, streamFilter],
        },
      },
    ])
      .sort({ datePosted: -1 })
      .exec();

    let streams = taggedStreams.map((o) => {
      const { posts, _id, links, ...rest } = o;
      // const { posts, _id, links, ...rest } = o;
      let stringLinks = links.map((link) => JSON.parse(link));
      return {
        ...rest,
        links: stringLinks,
        streamId: o._id,
        posts: posts.length,
      };
    });
    if (!streams.length > 0) {
      return res.status(200).send({ posts: [], streams: [] });
    }

    // const posts = await Post.find(postFilter).sort({ datePosted: -1 });
    // console.log(taggedStreams);

    const postFilter =
      trackedStream.length > 0
        ? {
            $or: trackedStream.map((_id) => ({
              streamId: new mongoose.Types.ObjectId(_id),
            })),
          }
        : {};

    const postsv2 = await Post.aggregate([
      {
        $match: {
          $and: [
            {
              $or: taggedStreams.map((stream) => ({ streamId: stream._id })),
            },
            postFilter,
          ],
        },
      },
    ])
      .sort({ datePosted: -1 })
      .exec();
    res
      .status(200)
      .send({ streams, posts: postsv2.slice(page * 5, page * 5 + 5) });
    return;
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

// router.get("/posts", async (req, res) => {
//   let page = req.headers.page - 1;
//   // console.log(new Date(dt).getSeconds());
//   // dt =
//   //   dt == 0
//   //     ? new Date()
//   //     : new Date(dt).setSeconds(new Date(dt).getSeconds() - 10);
//   // //
//   const posts = await Post.find({
//     // datePosted: {
//     //   $lte: dt,
//     // },
//   }).sort({ datePosted: -1 });
//   res.send(posts.slice(page * 5, page * 5 + 5));
// });

// router.get("/posts/:streamId", async (req, res) => {
//   let page = req.headers.page - 1;
//   const posts = await Post.find({ streamId: req.params.streamId }).sort({
//     datePosted: -1,
//   });
//   res.send(posts.slice(page * 5, page * 5 + 5));
// });

router.post("/login", async (req, res) => {
  const admin = await User.findOne({});
  const { password, ...rest } = admin.toObject();
  if (req.body.password === process.env.PASSWORD) {
    res.status(200).send({ ...rest });
  } else {
    res.status(400).send({ error: "Invalid Credentials" });
  }
});

module.exports = router;
