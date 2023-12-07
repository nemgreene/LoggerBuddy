import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";

function PictureViewer({ images, index }) {
  return (
    <Carousel
      onChange={(e) => {
        console.log(e, "changin");
      }}
      next={() => {
        console.log("next");
      }}
      className="CarouselWrapper"
      sx={{
        height: "80vh",
        width: "80vw",
      }}
      autoPlay={false}
    >
      {images.map((data, i) => (
        <div
          key={i}
          className="Test"
          style={{
            //   overflow: "hidden",
            height: "75vh",
            width: "100%",
            minHeight: "50vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundImage: `url(${`data:image/jpeg;base64,${data}`})`,
            borderRadius: "10px",
            cursor: "pointer",
          }}
        ></div>
      ))}
    </Carousel>
  );
}

export default PictureViewer;
