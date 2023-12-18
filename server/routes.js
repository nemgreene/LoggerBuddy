const express = require("express");
// const Stream = require("./models/Stream");
const Stream = require("./models/StreamV2");
const Post = require("./models/Post");
require("dotenv").config();
const User = require("./models/User");
const { uuid } = require("uuidv4");
const mongoose = require("mongoose");

const router = express.Router();

//create a new stream
router.post("/streams/add", async (req, res, next) => {
  try {
    const stream = new Stream({ ...req.body, dateCreated: new Date() });
    console.log(stream);
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
    let streams;
    const { streamid } = req.headers;
    if (streamid && streamid === "false") {
      streams = await Stream.find({});
    } else {
      streams = await Stream.find({ _id: streamid });
    }
    console.log(streams.length);
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
//get stream headers
router.post("/posts/tagged", async (req, res, next) => {
  try {
    let { tags, page, trackedStream } = req.body;
    page -= 1;

    // const taggedStreams = await Stream.find(
    //   tags.length > 0
    //     ? {
    //         $or: tags.map((tags) => ({ tags })),
    //       }
    //     : {}
    // );
    const trackedFilter = trackedStream
      ? { _id: new mongoose.Types.ObjectId(trackedStream) }
      : {};

    const taggedFilter =
      tags.length > 0
        ? {
            $or: tags.map((tags) => ({ tags })),
          }
        : {};
    // const posts = await Post.find(postFilter).sort({ datePosted: -1 });
    // console.log(taggedStreams);
    const taggedStreams = await Stream.aggregate([
      {
        $match: {
          $and: [taggedFilter, trackedFilter],
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

    const postFilter = trackedStream
      ? { streamId: new mongoose.Types.ObjectId(trackedStream) }
      : {};
    // const posts = await Post.find(postFilter).sort({ datePosted: -1 });
    // console.log(taggedStreams);
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

router.post("/posts/add", async (req, res) => {
  try {
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
  let page = req.headers.page - 1;
  const posts = await Post.find({ streamId: req.params.streamId }).sort({
    datePosted: -1,
  });
  res.send(posts.slice(page * 5, page * 5 + 5));
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

//random cleanup endpoints
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
  // const posts = await Post.find({});
  // let streams = await Stream.find({});
  // posts.forEach((post) => {
  //   streams.forEach((stream, i) => {
  //     if (stream._id.equals(post.streamId)) {
  //       // console.log(streams[i]);
  //       streams[i].posts = [...streams[i].posts, post._id];
  //       // streams[i].posts = [];
  //       return;
  //     }
  //   });
  // });

  // await Promise.all(
  //   streams.map(async (element, i) => {
  //     const iStream = await Stream.findOneAndUpdate(
  //       { _id: element._id },
  //       { posts: streams[i].posts }
  //     );
  //     await iStream.save();
  //   })
  // );

  //reattach all posts to new stream id
  const posts = await Post.find({});
  let streams = await Stream.find({});

  res.send(200);
  // })
  // const ret = await Post.deleteMany({ streamName: "Bamboo Scripter" });
  // res.send(ret);
});

router.delete("/migrate", async (req, res) => {
  // const streams = await Stream.find({});
  // const up = await Promise.all(
  //   streams.map(async (element, i) => {
  //     const { _id, ...rest } = element.toObject();
  //     const stream = new StreamV2(rest);
  //     const { streamId } = stream;
  //     await Promise.all(
  //       stream.posts.map(async (postId) => {
  //         const postObj = await Post.findOneAndUpdate(
  //           { _id: postId },
  //           { streamId }
  //         );
  //       })
  //     );
  //     return "Test";
  //     // await stream.save();
  //   })
  // );
  // res.status(200).send(up);

  // const streams = await Stream.find({});
  // const up = await Promise.all(
  //   streams.map(async (element, i) => {
  //     const { _id, ...rest } = element.toObject();
  //     const stream = new StreamV2(rest);
  //     await Promise.all(
  //       stream.posts.map(async (postId) => {
  //         const postObj = await Post.findOneAndUpdate(
  //           { _id: postId },
  //           { streamId: stream._id }
  //         );
  //       })
  //     );
  //     await stream.save();
  //   })
  // );
  res.status(200).send(up);
});

module.exports = router;
