import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Skeleton from "@mui/material/Skeleton";
import { Grid, Typography, Container } from "@mui/material";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee20",
  borderStyle: "dashed",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function DragAndDrop({ images, changeImages }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const list = [];

    acceptedFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        list.push(new Buffer.from(binaryStr).toString("base64"));
        if (i === acceptedFiles.length - 1) {
          changeImages((p) => (p ? [...p, ...list] : list));
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      <div {...getRootProps({ style })}>
        <Container>
          <Typography variant="h5">Paste, Drop, or Click to Upload</Typography>
          {!images ? <br /> : null}
        </Container>
        <input {...getInputProps()} />
        {images ? null : (
          //   <Pictures images={images} />
          <Grid container sx={{ height: "20vh" }}>
            <Grid
              item
              container
              justifyContent={"center"}
              //   alignContent={"center"}
              xs={6}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                width={"95%"}
                height={"90%"}
              />
            </Grid>
            <Grid
              item
              container
              justifyContent={"center"}
              //   alignContent={"center"}
              xs={6}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                width={"95%"}
                height={"40%"}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width={"95%"}
                height={"40%"}
              />
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
}
