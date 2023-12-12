const express = require("express");
const Stream = require("./models/Stream");
const Post = require("./models/Post");
require("dotenv").config();
const User = require("./models/User");
const { uuid } = require("uuidv4");

const router = express.Router();

//create a new stream
router.post("/streams/add", async (req, res, next) => {
  try {
    const stream = new Stream({ ...req.body, dateCreated: new Date() });
    await stream.save();
    const { posts, _id, ...rest } = stream.toObject();
    res.send({ ...rest, streamId: stream._id });
  } catch (e) {
    res.send(e);
  }
});
//get stream headers
router.get("/streams/headers", async (req, res, next) => {
  try {
    const streams = await Stream.find({});
    // const output = streams.map(({ posts, ...rest }) => rest);
    let ret = streams.map((o) => {
      const { posts, _id, ...rest } = o.toObject();
      return { ...rest, streamId: o._id, posts: posts.length };
    });
    res.send(ret);
  } catch (e) {
    res.send(e);
  }
});

router.post("/posts/add", async (req, res) => {
  try {
    console.log("adding");
    //this needs to add to the posts count per stream
    const stream = await Stream.findOne({ _id: req.body.streamId });
    const post = new Post({
      ...req.body,
      datePosted: new Date(),
      color: stream.color,
    });
    stream.posts = [...stream.posts, post._id];
    await stream.save();
    await post.save();
    return res.send({ status: 200 });
  } catch (e) {
    console.log(e, "error");
    return res.send(e);
  }
});

router.get("/posts", async (req, res) => {
  let page = req.headers.page - 1;

  // console.log(new Date(dt).getSeconds());
  // dt =
  //   dt == 0
  //     ? new Date()
  //     : new Date(dt).setSeconds(new Date(dt).getSeconds() - 10);
  // //
  const posts = await Post.find({
    // datePosted: {
    //   $lte: dt,
    // },
  }).sort({ datePosted: -1 });
  res.send(posts.slice(page * 5, page * 5 + 5));
});

router.get("/posts/:streamId", async (req, res) => {
  const posts = await Post.find({ streamId: req.params.streamId });
  res.send(posts);
});

router.post("/login", async (req, res) => {
  const admin = await User.findOne({});
  const { password, ...rest } = admin.toObject();
  if (req.body.password === process.env.PASSWORD) {
    res.status(200).send({ ...rest });
  } else {
    res.status(400).send({ error: "Invalid Credentials" });
  }
});

router.delete("/cleanup", async (req, res) => {
  // const posts = await Post.find({});
  // let streams = await Stream.find({});
  // posts.forEach((post, pI) => {
  //   streams.forEach((stream, sI) => {
  //     if (stream._id.equals(post.streamId)) {
  //       // console.log(streams[i]);
  //       // streams[i].posts = [...streams[i].posts, post._id];
  //       posts[pI].color = streams[sI].color;
  //       // streams[i].posts = [];
  //       return;
  //     }
  //   });
  // });

  // await Promise.all(
  //   posts.map(async (element, i) => {
  //     const iStream = await Post.findOneAndUpdate(
  //       { _id: element._id },
  //       { color: posts[i].color }
  //     );
  //     await iStream.save();
  //   })
  // );

  //bind all posts to their parent streams
  const posts = await Post.find({});
  let streams = await Stream.find({});
  posts.forEach((post) => {
    streams.forEach((stream, i) => {
      if (stream._id.equals(post.streamId)) {
        // console.log(streams[i]);
        streams[i].posts = [...streams[i].posts, post._id];
        // streams[i].posts = [];
        return;
      }
    });
  });

  await Promise.all(
    streams.map(async (element, i) => {
      const iStream = await Stream.findOneAndUpdate(
        { _id: element._id },
        { posts: streams[i].posts }
      );
      await iStream.save();
    })
  );

  res.send(200);
  // })
  // const ret = await Post.deleteMany({ streamName: "Bamboo Scripter" });
  // res.send(ret);
});

module.exports = router;
