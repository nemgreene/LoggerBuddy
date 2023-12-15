import { Grid, Slider } from "@mui/material";

import React from "react";
import FrameA from "../img/1.png";
import FrameB from "../img/2.png";
import FrameC from "../img/3.png";
import FrameD from "../img/4.png";
import FrameE from "../img/5.png";
import FrameF from "../img/6.png";
import FrameG from "../img/7.png";
import FrameH from "../img/8.png";
import FrameI from "../img/9.png";
import FrameJ from "../img/10.png";
import FrameK from "../img/11.png";
import FrameL from "../img/12.png";
import FrameM from "../img/13.png";
import FrameN from "../img/14.png";
import FrameO from "../img/15.png";
import FrameP from "../img/16.png";
import FrameQ from "../img/17.png";
import FrameR from "../img/18.png";
import FrameS from "../img/19.png";
import FrameT from "../img/20.png";
import FrameU from "../img/21.png";
import FrameV from "../img/22.png";
import FrameW from "../img/23.png";
import FrameX from "../img/24.png";

let GalleryArr = [
  FrameA,
  FrameB,
  FrameC,
  FrameD,
  FrameE,
  FrameF,
  FrameG,
  FrameH,
  FrameI,
  FrameJ,
  FrameK,
  FrameL,
  FrameM,
  FrameN,
  FrameO,
  FrameP,
  FrameQ,
  FrameR,
  FrameS,
  FrameT,
  FrameU,
  FrameV,
  FrameW,
  FrameX,
];

export default function BioDrawer({ client, credentials }) {
  const [value, setValue] = React.useState(
    Math.floor(Math.random() * GalleryArr.length)
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
      className="BioDrawer"
      container
      justifyContent={"center"}
      alignContent={"start"}
      style={{ width: "100%", height: "90%" }}
    >
      <Grid item container justifyContent={"center"} xs={2}>
        {/* <Slider
          aria-label="Temperature"
          defaultValue={1}
          color="info"
          value={value}
          onChange={handleChange}
          orientation="vertical"
          // getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={24}
        /> */}
      </Grid>
      <Grid
        item
        container
        xs={6}
        style={{ overflow: "hidden", height: "25%" }}
        justifyContent={"center"}
      >
        {/* <div
          style={{
            overflow: "hidden",
            height: "100%",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundImage: `url(${GalleryArr[value - 1]})`,
            borderRadius: "10px",
            cursor: "pointer",
          }}
          alt=""
        /> */}
        <Grid
          item
          style={{
            height: "100%",
            width: "fit-content",
          }}
        >
          <img
            onClick={() =>
              client.redirect(credentials?.accessToken ? "/admin" : "/login")
            }
            src={GalleryArr[value]}
            style={{
              height: "100%",
              width: "auto",
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
}
