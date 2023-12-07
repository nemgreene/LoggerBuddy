import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Grid,
  Typography,
  Button,
  Container,
  Tooltip,
  Modal,
  Box,
} from "@mui/material";
import PictureViewer from "./Carousel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "fit-content",
  height: "fit-content",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Pictures({ images }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (index) => {
    console.log(index);
    setOpen(index);
  };
  const handleClose = () => setOpen(false);

  const DecodedImage = ({ data, style, index }) => (
    <Tooltip title="Click to expand">
      <div
        onClick={() => handleOpen(index)}
        style={{
          overflow: "hidden",
          height: "100%",
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${`data:image/jpeg;base64,${data}`})`,
          borderRadius: "10px",
          ...style,
          cursor: "pointer",
        }}
      ></div>
    </Tooltip>
  );

  return (
    <Container>
      <Modal
        open={open !== false ? true : false}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
          <PictureViewer images={images} />
        </Box>
      </Modal>
      <Grid container sx={{ height: "40vh" }}>
        <Grid item xs={6} sx={{ padding: "5px" }}>
          <DecodedImage index={0} data={images[0]} />
        </Grid>
        <Grid item xs={6} container>
          {images.slice(1, 6).map((img, i) => (
            <Grid key={i} xs={4} item sx={{ padding: "5px", maxHeight: "50%" }}>
              <DecodedImage index={i + 1} data={img} />
            </Grid>
          ))}
          {images.length > 5 ? (
            <Grid
              xs={4}
              item
              sx={{
                padding: "5px",
                maxHeight: "50%",
                position: "relative",
                zIndex: "5",
              }}
            >
              <DecodedImage
                index={-1}
                data={images[6]}
                style={{ filter: "blur(10px)", position: "absolute" }}
              />
              <Tooltip title="See More">
                <MoreHorizIcon
                  sx={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 60,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-40%, -50%)",
                  }}
                />
              </Tooltip>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}
