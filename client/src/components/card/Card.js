import {
  CardActionArea,
  Card,
  CardMedia,
  CardHeader,
  Avatar,
} from "@mui/material";
import React from "react";
import Img from "../../images/farm.jpeg";

const Cards = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          Res
          <Avatar sx={{ color: "red" }}>R</Avatar>
        </CardHeader>
        <CardMedia component="img" src={Img}></CardMedia>
        <CardActionArea></CardActionArea>
      </Card>{" "}
    </div>
  );
};

export default Cards;
