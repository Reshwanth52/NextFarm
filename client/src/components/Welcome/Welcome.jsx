import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Welcome.css";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const Welcome = () => {
  const alert = useAlert();
  const [menuCards, setMenuCards] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/menuItem")
      .then((data) => setMenuCards(data.data.menuItems))
      .catch();
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
      {menuCards ? (
        <div className="cards">
          <Card />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Welcome;
