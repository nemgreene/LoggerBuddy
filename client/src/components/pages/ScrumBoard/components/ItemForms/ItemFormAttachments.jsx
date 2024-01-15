import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useEffect } from "react";
import StreamLinksTable from "../../../../StreamLinksTable";
import DragAndDrop from "../../../../DragAndDrop";
import { Buffer } from "buffer";
import Pictures from "../../../../Pictures";

export default function ItemFormAttachments({
  images,
  changeImages,
  editIndex,
  changeEditIndex,
  client,
  attachments,
  changeLinks,
  changeFormErrors,
}) {
  const deleteImage = (id) => {
    let update = [...images];
    update = update.filter((_, i) => i != id);
    if (update.length > 0) {
      changeImages(update);
    }
    changeImages(undefined);
    console.log(update);
  };

  const toggleCheck = (v) => {
    changeFormErrors((p) => ({ ...p, attachmentToggle: false }));
    changeEditIndex(v);
  };
  const handleSubmit = (v) => {
    changeLinks(v);
    console.log("changing");
  };

  return (
    <>
      <Card
        sx={{ mb: (t) => `${t.spacing(2)} `, width: "100%" }}
        onPaste={(e) => {
          if (e.clipboardData.files.length) {
            const fileObject = e.clipboardData.files[0];
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
              const binaryStr = new Buffer.from(reader.result).toString(
                "base64"
              );
              changeImages((p) => (p ? [...p, binaryStr] : [binaryStr]));
            };
            reader.readAsArrayBuffer(fileObject);
          }
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              justifyContent: "center",
              m: (t) => t.spacing(1),
              textAlign: "center",
            }}
          >
            Images
          </Typography>
          {images?.length > 0 && (
            <Pictures images={images} edit={deleteImage} />
          )}
          <DragAndDrop images={images} changeImages={changeImages} />
        </CardContent>
      </Card>
      {/* <Card sx={{ m: (t) => `${t.spacing(2)} 0px`, width: "100%" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              justifyContent: "center",
              mt: (t) => t.spacing(1),
              textAlign: "center",
            }}
          >
            Links
          </Typography>
          <StreamLinksTable
            links={attachments}
            client={client}
            changeLinks={handleSubmit}
            editIndex={editIndex}
            changeEditIndex={isNaN(editIndex) ? toggleCheck : () => {}}
          />
        </CardContent>
      </Card> */}
    </>
  );
}
