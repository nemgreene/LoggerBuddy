const express = require("express");
const Stream = require("./models/StreamV2");
const Post = require("./models/Post");
const Scrum = require("./models/Scrum");
require("dotenv").config();
const User = require("./models/User");
const { uuid } = require("uuidv4");
const { ObjectId, StreamDescription } = require("mongodb");
const mongoose = require("mongoose");

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

router.post("/posts/add", async (req, res) => {
  try {
    //this needs to add to the posts count per stream
    const stream = await Stream.findOne({
      _id: new mongoose.Types.ObjectId(req.body.streamId),
    });
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
    return res.send(e);
  }
});

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

    const ret = await Stream.findOneAndUpdate(
      { _id: streamId },
      { streamDescription, dateCreated, tags, links: stringLinks }
    );
    res.status(200).send("Stream Updated");
  } catch (e) {
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
    res.status(400).send({ error: "Error Deleting post..." });
  }
});

//SCRUM Board

router.post("/scrum/add", async (req, res) => {
  const { trackedStream } = req.body;
  //verify stream exists
  const stream = await Stream.findOne({ _id: trackedStream });
  if (stream._id != trackedStream) {
    return res.status(400).send("No stream with that id, logging out...");
  }
  //make new scrum
  const scrum = new Scrum({
    streamId: trackedStream,
    columns: [],
    tasks: [],
    support: {},
  });
  await scrum.save();
  res.send(scrum);
});

router.post("/scrum/column/add", async (req, res) => {
  const {
    trackedStream,
    formData: { name, color, index },
  } = req.body;

  const id = new mongoose.Types.ObjectId();
  const ret = await Scrum.findOne({ streamId: trackedStream });
  ret.columns.push({ id, title: name, color, index: ret.columns.length });
  await ret.save();

  res.send(ret.columns);
});
router.post("/scrum/column/edit", async (req, res) => {
  const {
    trackedStream,
    _id,
    formData: { name, color, index },
  } = req.body;

  const ret = await Scrum.findOne({
    streamId: new mongoose.Types.ObjectId(trackedStream),
  });
  ret.columns = ret.columns.map((v) =>
    v.id == _id ? { ...v, title: name, color } : { ...v }
  );
  await ret.save();

  res.send(ret.columns);
});

router.delete("/scrum/column/:id", async (req, res) => {
  const id = req.params.id;

  const ret = await Scrum.findOne({
    columns: {
      $elemMatch: {
        id: new mongoose.Types.ObjectId(id),
      },
    },
  });
  if (ret) {
    ret.columns = [...ret.columns]
      .filter((v) => v.id != id)
      .map((v, i) => ({ ...v, index: i }));
    await ret.save();
    return res.status(200).send(ret);
  }
  // return res.status(400).send("No column found");
});

router.post("/scrum/column/sync", async (req, res) => {
  const { trackedStream, update } = req.body;

  const ret = await Scrum.findOneAndUpdate(
    { streamId: trackedStream },
    {
      columns: [...update].map((v) => ({
        ...v,
        id: new mongoose.Types.ObjectId(v.id),
      })),
    }
  );

  res.send(ret);
});

router.post("/scrum/item/add", async (req, res) => {
  const { trackedStream, formData } = req.body;

  const id = new mongoose.Types.ObjectId().toString();
  const ret = await Scrum.findOne({ streamId: trackedStream });
  //if active scrum
  if (!ret) {
    return res.status(404).send({ error: "No Scrum Board found..." });
  }
  // ret.tasks = [...ret.tasks, ]
  let issueNumber = ret.tasks.sort((a, b) => {
    a.issueNumber - b.issueNumber;
  })[ret.tasks.length - 1]?.issueNumber;

  let index = ret.tasks.sort((a, b) => {
    a.index - b.index;
  })[ret.tasks.length - 1]?.index;

  index = !isNaN(index) ? index + 1 : 0;
  issueNumber = !isNaN(issueNumber) ? issueNumber + 1 : 0;

  ret.tasks.push({ ...formData, index, id, issueNumber });
  await ret.save();
  res.send(ret);
  // res.send(ret.columns);
});

router.post("/scrum/item/update", async (req, res) => {
  const { trackedStream, formData } = req.body;

  const ret = await Scrum.findOne({ streamId: trackedStream });
  //if active scrum
  if (!ret) {
    return res.status(404).send({ error: "No Scrum Board found..." });
  }

  ret.tasks = ret.tasks.map((v) => {
    if (v.id == formData.id) {
      return { ...v, id: new mongoose.Types.ObjectId(v.id), ...formData };
    }
    return v;
  });

  await ret.save();
  res.send(ret);
  // res.send(ret.columns);
});

router.post("/scrum/item/taskUpdate", async (req, res) => {
  const { taskId, update } = req.body;
  const ret = await Scrum.findOne({
    tasks: {
      $elemMatch: {
        id: taskId,
      },
    },
  });
  if (ret) {
    ret.tasks = [...ret.tasks].map((v, i) => {
      if (v.id == taskId) {
        updatedItem = {
          ...v,
          ...update,
        };
        return updatedItem;
      }
      return v;
    });
    await ret.save();

    return res.status(200).send(ret.tasks);
  }
  return res.status(400).send({ error: "No item found" });
});

router.delete("/scrum/item/:id", async (req, res) => {
  const id = req.params.id;

  const ret = await Scrum.findOne({
    tasks: {
      $elemMatch: {
        id: id,
      },
    },
  });
  if (ret) {
    ret.tasks = [...ret.tasks]
      .filter((v) => v.id != id)
      .map((v, i) => ({ ...v, index: i }));
    await ret.save();

    return res.status(200).send(ret);
  }
  return res.status(400).send("No item found");
});

//random cleanup endpoints
router.delete("/cleanup", async (req, res) => {
  // const posts = await Post.find({});
  // let streams = await Stream.find({});
  // posts.forEach((post, pI) => {
  //   streams.forEach((stream, sI) => {
  //     if (stream._id.equals(post.streamId)) {
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
