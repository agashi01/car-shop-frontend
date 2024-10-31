/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */


import { React, useEffect, useState } from "react";
import { axiosInstance as useAxiosInstance } from "./AxiosConfig.jsx";

// eslint-disable-next-line react/prop-types
export default function CarCard({ removeId, carId, deletMarket, deletSold, id, isit, guest, car }) {
  id = parseInt(id)

  const [purchased, setPurchased] = useState(false);
  const [flip, setFlip] = useState(false);
  const [removeMenu, setRemoveMenu] = useState(false);
  const [theOne, setTheOne] = useState(false)
  const [path] = useState(car.paths[0]) || []
  const [current, setCurrent] = useState(0)
  const [isLeftHovered, setIsLeftHovered] = useState(false)
  const [isRightHovered, setIsRightHovered] = useState(false)
 
  const [isSliding, setIsSliding] = useState(false)


  const [images, setImages] = useState([])

  useEffect(() => {
    if (path) {
      const bufferImages = path.map((url) => {
        const image = new Image()
        image.src = url
        return image

      })
      if (bufferImages) setImages(bufferImages)

    }

  }, [])


  const axiosInstance = useAxiosInstance()

  const carObj = Object.keys(car);

  const transmission = (e) => {
    if (e === "automatic_transmission") return "automatic";
    return e;
  };

  useEffect(() => {
    if (removeId === car.id) {
      setTheOne(true)
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
      .catch((err) => console.log(err));
  };

  const mileageUpdate = (km) => {
    let string = km.toString().split("");
    let final = "";
    let ans = '';

    let num = 1;
    for (let i = string.length - 1; i >= 0; i--) {
      final += string[i];

      if (num % 3 === 0 && num != 0 && !(i === 0)) {
        final += ",";
      }
      num++;
    }
    num = 0
    for (let x = final.length - 1; x >= 0; x--) {
      ans += final[x]
    }
    return ans + " km";
  };

  const prevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSliding(true)

    setTimeout(() => {
      setCurrent(() => {
        return (current - 1 + images.length) % images.length
      })
      setIsSliding(false)
    }, 500)

  }

  const nextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSliding(true)
    setTimeout(() => {
      setCurrent(() => {
        return (current + 1) % images.length
      })
      setIsSliding(false)

    }, 500)

  }

  return (
    // eslint-disable-next-line react/prop-types
    <div onClick={() => setFlip(!flip)} className={flip ? "car-card flip" : "car-card"}>
      <div className="front">
        <div className="card-png">
          <button onMouseEnter={() => setIsLeftHovered(true)} onMouseLeave={() => setIsLeftHovered(false)} style={{ opacity: isLeftHovered ? "1" : ".76" }} className="image-button left" onClick={prevImage}>&lt;</button>
          <div className={`image-container ${isSliding ? 'sliding' : ''}`}>
            <img  className={`carcard-image`} src={images[current]?.src}></img>
            <div  className='white-balls-div'>
              {images.length ? images.map((url, index) => {
                return <div key={index} className={`white-balls ${index === current ? 'blue' : ''}`}></div>
              }) : null}
            </div>

          </div>
          <button onMouseEnter={() => setIsRightHovered(true)} onMouseLeave={() => setIsRightHovered(false)} style={{ opacity: isRightHovered ? "1" : ".76" }} className="image-button right" onClick={nextImage}>&gt;</button>
        </div>
        <div className="png-div">
          {removeId === car.id || theOne ?
            'Removed'
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
          {removeId === car.id || theOne ?
            <div>
              <button
                className="remove done"
              >
                Removed
              </button>
            </div>
            : car.dealer_id === id && !car.owner_id ? (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    carId(car.id)
                    deletMarket(true);
                  }}
                  className="remove"
                  onMouseEnter={() => setRemoveMenu(true)}
                  onMouseLeave={() => setRemoveMenu(false)}
                >
                  Remove
                </button>
                {(removeId === car.id || theOne) || removeMenu ? (
                  <div className="remove-menu">Remove This Car From The Market</div>
                ) : null}
              </div>
            ) : car.dealer_id === id ? (
              <div>
                <button onClick={(e) => {
                  e.stopPropagation()
                  carId(car.id)
                  deletSold(true)
                }} className="remove">
                  Remove
                </button>
              </div>
            ) : null}
        </div>
      </div>
    </div>
  );
}