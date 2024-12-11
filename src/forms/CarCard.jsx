/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { React, useEffect, useState, useRef } from "react";
import { axiosInstance as useAxiosInstance } from "./AxiosConfig.jsx";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { transform } from "lodash";
import { BiIdCard } from "react-icons/bi";

// eslint-disable-next-line react/prop-types
export default function CarCard({
  changeOwner,
  outOfStockMessage,
  refreshPage,
  bigImage,
  setImagesLength,
  currentImageIndex,
  setCurrentImageIndex,
  image,
  removeId,
  setCarId,
  carId,
  deletMarket,
  deletSold,
  id,
  isit,
  guest,
  car,
}) {
  id = parseInt(id);

  const [purchased, setPurchased] = useState(false);
  const [flip, setFlip] = useState(false);
  const [removeMenu, setRemoveMenu] = useState(false);
  const [theOne, setTheOne] = useState(false);
  const [path] = useState(car.paths[0]) || [];
  const [current, setCurrent] = useState(0);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [expandHover, setExpandHover] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [cardWidth, setCardWidth] = useState(null);

  const imageContainer = useRef();
  const [runIMagesEffect, setRunIMagesEffect] = useState(false);
  const [imageDimensions, setImageDimensions] = useState([]);

  const [isSliding, setIsSliding] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (currentImageIndex != null && currentImageIndex !== current) {
      if (carId === car.id) {
        setCurrent(currentImageIndex);
        image(images[currentImageIndex] && images[currentImageIndex]);
      }
    }
  }, [currentImageIndex]);

  useEffect(() => {
    if (!path) return;

    const bufferImages = path.map((url) => {
      const image = new Image();
      image.src = url;
      return image;
    });

    if (bufferImages) setImages(bufferImages);

    setTimeout(() => {
      setLoading(false);
      setRunIMagesEffect(!runIMagesEffect);
    }, 1000); //check this number after deployment
  }, []);

  useEffect(() => {
    if (!imageContainer.current || !images.length) return;
    // let max = 0;
    // const dimensions = images.map((image) => {
    // const containerWidth = imageContainer.current.offsetWidth;
    // const containerHeight = imageContainer.current.offsetHeight;

    //   const scaleFactor = Math.min(containerWidth / image.width, containerHeight / image.height);

    //   const scaledWidth = image.width * scaleFactor;
    //   if (max === 0 || scaledWidth < max) {
    //     max = scaledWidth;
    //   }
    //   const scaledHeight = image.height * scaleFactor;

    //   return [scaledHeight, scaledWidth];
    // });

    setImageDimensions([imageContainer.current.offsetHeight, imageContainer.current.offsetWidth]);
    // console.log(imageContainer.current.offsetWidth);
    // setCardWidth(max);
  }, [runIMagesEffect, images, refreshPage]);

  const axiosInstance = useAxiosInstance();

  const carObj = Object.keys(car);

  const transmission = (e) => {
    if (e === "automatic_transmission") return "automatic";
    return e;
  };

  useEffect(() => {
    if (removeId === car.id) {
      setTheOne(true);
    }
  }, [removeId]);

  const purchasing = (carId) => (e) => {
    e.stopPropagation();
    if (guest) {
      isit(true);
      return;
    }

    axiosInstance
      .put("/cars", { id, carId })
      .then(() => {
        setPurchased(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.message === "This car is out of stock") {
          outOfStockMessage(true);
          setOutOfStock(true);
          changeOwner(err.response.data.id, err.response.data.ownerId);
        }
      });
  };

  const mileageUpdate = (km) => {
    let string = km.toString().split("");
    let final = "";
    let ans = "";

    let num = 1;
    for (let i = string.length - 1; i >= 0; i--) {
      final += string[i];

      if (num % 3 === 0 && num != 0 && !(i === 0)) {
        final += ",";
      }
      num++;
    }
    num = 0;
    for (let x = final.length - 1; x >= 0; x--) {
      ans += final[x];
    }
    return ans + " km";
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSliding(true);

    setTimeout(() => {
      setCurrent(() => {
        return (current - 1 + images.length) % images.length;
      });
      setIsSliding(false);
    }, 500);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSliding(true);
    setTimeout(() => {
      setCurrent(() => {
        return (current + 1) % images.length;
      });
      setIsSliding(false);
    }, 500);
  };

  const expandImage = (e) => {
    e.stopPropagation();
    setImagesLength(images.length);
    setCurrentImageIndex(current);
    setCarId(car.id);
    image(images[current] && images[current]);
  };
  return (
    // eslint-disable-next-line react/prop-types
    <div
      onClick={() => setFlip(!flip)}
      // style={cardWidth !== null ? { width: `${cardWidth}px` } : {}}
      className={flip ? "car-card flip" : "car-card"}
    >
      <div className="front">
        <div ref={imageContainer} className="card-png">
          <button
            onMouseEnter={() => setIsLeftHovered(true)}
            onMouseLeave={() => setIsLeftHovered(false)}
            style={{ opacity: isLeftHovered ? "1" : ".76" }}
            className="image-button left"
            onClick={prevImage}
          >
            &lt;
          </button>
          {loading ? (
            <div className="loading-carcard">
              <div className="my-loading"></div>
            </div>
          ) : (
            <div className={`image-container ${isSliding ? "sliding" : ""}`}>
              <img
                style={
                  imageDimensions.length > 0 &&
                  !isNaN(imageDimensions[0]) &&
                  !isNaN(imageDimensions[1])
                    ? { height: imageDimensions[0], width: imageDimensions[1] }
                    : {}
                }
                // style={{width:'348px'}}
                className={`carcard-image`}
                src={images[current]?.src}
              />
              <div style={{ height: "20px" }} className="expand" onClick={expandImage}>
                <FaExpandArrowsAlt
                  style={{
                    transform: isPressed ? "scale(0.9)" : expandHover ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.1s ease-in-out",
                  }}
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onMouseEnter={() => setExpandHover(true)}
                  onMouseLeave={() => setExpandHover(false)}
                  size={20}
                  color="black"
                />
              </div>
              <div className="white-balls-div">
                {images.length
                  ? images.map((url, index) => (
                      <div
                        key={index}
                        className={`white-balls ${index === current ? "blue" : ""}`}
                      />
                    ))
                  : null}
              </div>
            </div>
          )}
          <button
            onMouseEnter={() => setIsRightHovered(true)}
            onMouseLeave={() => setIsRightHovered(false)}
            style={{ opacity: isRightHovered ? "1" : ".76" }}
            className="image-button right"
            onClick={nextImage}
          >
            &gt;
          </button>
        </div>
        <div className="png-div">
          {outOfStock
            ? "Out of Stock"
            : removeId === car.id || theOne
              ? "Removed"
              : car.dealer_id === id && car.owner_id
                ? "Sold"
                : car.dealer_id === id && !car.owner_id
                  ? "On Market"
                  : purchased || (car.owner_id != null && id != null && car.owner_id === id)
                    ? "Owned"
                    : car.owner_id
                      ? "Out of Stock"
                      : "In Stock"}
        </div>
        <div className="marka">{car.make}</div>
        <div className="card-features">
          <div className="car-model">{car.model}</div>
          <div className="car-mileage">{mileageUpdate(car.mileage)}</div>
        </div>
      </div>
      <div className="back">
        <div className="specification">
          Dealer : {car.name} {car.surname}
        </div>
        <div className="specification">
          {carObj[3]}: {car.make}
        </div>
        <div className="specification">
          {carObj[4]}: {car.model}
        </div>
        <div className="specification">
          {carObj[5]}: {mileageUpdate(car.mileage)}
        </div>
        <div className="specification">
          {carObj[8]}: {car.fuel_type}
        </div>
        <div className="specification">
          {carObj[9]}: {car.vehicle_type}
        </div>
        <div className="specification">
          {carObj[7]}: {transmission(car.transmission)}
        </div>
        <div className="specification">
          {carObj[6]}: {car.color}
        </div>
        {car.owner ? (
          <div className="specification">
            {carObj[14]}: {car.owner}
          </div>
        ) : null}
        <div className="carCars-buttons">
          {purchased ? (
            <button className="purchased">Owned</button>
          ) : removeId === car.id || theOne ? (
            <button className="purchased">removed</button>
          ) : car.dealer_id === id && !car.owner_id ? (
            <button className="purchased">On Market</button>
          ) : car.dealer_id === id && car.owner_id ? (
            <button className="purchased">Sold</button>
          ) : car.owner_id != null && id != null && car.owner_id === id ? (
            <button className="purchased">Owned</button>
          ) : car.owner_id ? (
            <button className="purchased">Out of Stock</button>
          ) : (
            <button className="purchase" onClick={purchasing(car.id)} type="btn">
              Purchase
            </button>
          )}
          {removeId === car.id || theOne ? (
            <div>
              <button className="remove done">Removed</button>
            </div>
          ) : car.dealer_id === id && !car.owner_id ? (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarId(car.id);
                  deletMarket(true);
                }}
                className="remove"
                onMouseEnter={() => setRemoveMenu(true)}
                onMouseLeave={() => setRemoveMenu(false)}
              >
                Remove
              </button>
              {removeId === car.id || theOne || removeMenu ? (
                <div className="remove-menu">Remove This Car From The Market</div>
              ) : null}
            </div>
          ) : car.dealer_id === id ? (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarId(car.id);
                  deletSold(true);
                }}
                className="remove"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
