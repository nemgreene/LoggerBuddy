import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Grid, Container, Tooltip, Modal, Box, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import PictureViewer from "./Carousel";
import ClearIcon from "@mui/icons-material/Clear";

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

export default function Pictures({ images, edit }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (index) => {
    setOpen(index);
  };
  const handleClose = () => setOpen(false);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      top: -13,
      position: "absolute",
      "&:hover": {
        color: "error",
      },
    },
  }));

  const DecodedImage = ({ data, style, index }) => (
    <Tooltip title={edit ? "Click to Delete" : "Click to expand"}>
      <Container style={{ width: "100%", height: "100%", padding: 0 }}>
        <div
          onClick={() => {
            if (edit) {
              edit(index);
            } else {
              handleOpen(index);
            }
          }}
          style={{
            overflow: "hidden",
            height: "100%",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${`data:image/jpeg;base64,${data}`})`,
            borderRadius: "10px",
            border: "1px solid #eeeeee40",
            ...style,
            cursor: "pointer",
          }}
        ></div>
        <StyledBadge
          color={edit ? "error" : "primary"}
          badgeContent={
            edit ? (
              <ClearIcon
                fontSize="1px"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  edit(index);
                }}
              />
            ) : (
              index + 1
            )
          }
        ></StyledBadge>
      </Container>
    </Tooltip>
  );
  const CutImages = () => {
    return (
      <Grid
        container
        sx={{
          minHeight: "20vh",
        }}
      >
        <Grid item xs={6} sx={{ padding: "5px" }}>
          <DecodedImage index={0} data={images[0]} />
        </Grid>
        <Grid item xs={6} container>
          {images.slice(1, 6).map((img, i) => (
            <Grid key={i} xs={4} item sx={{ padding: "5px", maxHeight: "50%" }}>
              <DecodedImage index={i + 1} data={img} />
            </Grid>
          ))}
          {images.length > 6 ? (
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
                onClick={() => handleOpen(0)}
                index={-1}
                data={images[6]}
                style={{
                  filter: "blur(4px)",
                  position: "absolute",
                  height: "95%",
                }}
              />
              <MoreHorizIcon
                onClick={() => handleOpen(0)}
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 60,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  cursor: "pointer",
                  transform: "translate(-40%, -50%)",
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    );
  };
  const FullImages = () => {
    return (
      <Grid
        container
        sx={{
          height: `${Math.ceil(images.length / 3) * 10}vh`,
          maxHeight: "60vh",
          minHeight: "20vh",
        }}
      >
        <Grid item xs={12} container>
          {images.map((img, i) => (
            <Grid
              key={i}
              xs={4}
              item
              sx={{ padding: "5px", maxHeight: "100%" }}
            >
              <DecodedImage index={i} data={img} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
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
      {edit ? <FullImages /> : <CutImages />}
    </Box>
  );
}
