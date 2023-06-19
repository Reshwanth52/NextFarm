import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Welcome.css";

const Welcome = () => {
  const [menuCards, setMenuCards] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/menuItem")
      .then((data) => setMenuCards(data.data.menuItems))
      .catch((err) => console.log(err));
  }, []);

  const Card = () => {
    return (
      <div className="menuItem">
        {menuCards.map((item, index) => {
          return (
            <div className="card" key={index}>
              <div className="image">
                <img src={item.image.url} alt={item.title} />
                {item.title}
              </div>
              <div className="content">{item.content}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="welcome">
      <div className="cards">
        <Card />
        <Card />
        <Card />
        <Card />
        {/* <Card /> */}
      </div>
    </div>
  );
};

export default Welcome;
