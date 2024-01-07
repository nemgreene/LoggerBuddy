import React, { useState } from "react";
import PostForm from "./PostForm";
import { Button } from "@mui/material";
import { Buffer } from "buffer";

export default function EditPost({ streamHeaders, client, editPost }) {
  const [images, changeImages] = useState(editPost.images);
  const [formData, changeFormData] = useState(editPost);
  const [formErrors, changeFormErrors] = useState({});

  const deleteImage = (id) => {
    let update = [...images];
    update = update.filter((_, i) => i != id);
    changeImages(update || []);
  };

  const handleChange = (e, key, toggle = false) => {
    changeFormData((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleStreamChange = (e) => {
    if (e.target.value === "add") {
      changeFormData((p) => ({
        ...p,
        streamId: e.target.value,
      }));
    } else {
      const streamHeader = streamHeaders.filter(
        (v) => v.streamId == e.target.value
      )[0];
      changeFormData((p) => ({
        ...p,
        streamId: e.target.value,
        streamName: streamHeader.streamName,
        color: streamHeader.color,
      }));
      changeFormErrors((p) => ({
        ...p,
        streamId: true,
      }));
    }
  };

  const submitPost = async () => {
    const err = {};

    const optional = "h2 cut __v";

    Object.keys(formData).forEach((v) => {
      if (optional.includes(v)) {
        return;
      }
      if (!formData[v]) {
        err[v] = false;
      }
    });

    if (formData.streamId == "-1") {
      err.streamId = false;
    }
    changeFormErrors(err);
    if (JSON.stringify(err).includes("false")) {
      return;
    }

    // //passed checks, submit

    const res = await client.updatePost({
      ...formData,
      oldStream: editPost.streamId,
      images,
    });
  };

  const deletePost = async () => {
    const res = await client.deletePost(editPost._id);
  };

  const handlePaste = (e) => {
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = new Buffer.from(reader.result).toString("base64");
        changeImages((p) => (p ? [...p, binaryStr] : [binaryStr]));
      };
      reader.readAsArrayBuffer(fileObject);
    }
  };
  return (
    <div onPaste={handlePaste}>
      <PostForm
        client={client}
        images={images}
        changeImages={changeImages}
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
        handleStreamChange={handleStreamChange}
        streamHeaders={streamHeaders}
        submitPost={submitPost}
        editPost={editPost}
        edit={deleteImage}
      >
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => deletePost()}
        >
          Delete
        </Button>
      </PostForm>
    </div>
  );
}
