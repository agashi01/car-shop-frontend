import { React, useEffect, useState, useRef } from "react";
import { capitalize } from "lodash";
import { useNavigate } from "react-router-dom";
import { axiosInstance as useAxiosInstance } from "./AxiosConfig.jsx";

const validColorNames = [
  "black",
  "white",
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "magenta",
  "gray",
  "grey",
  "orange",
  "purple",
  "brown",
  // Add more named colors as needed
];

export default function Add({ id }) {
  const [allMake, setAllMake] = useState([]);
  const [allModel, setAllModel] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState([]);
  const [transmission, setTransmission] = useState([]);
  const [vehicleType, setVehicleType] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [value, setValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [toMuchTime,setToMuchTime]=useState(false)
  const [errorClassName,setErrorClassName]=useState('')

  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate()

  const divRef = useRef(null)
  const [maxWidth, setMaxWidth] = useState(0)

  const [error, setError] = useState({
    make: "",
    model: "",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
    vehicleType: "",
    file: null,
  });
  const [message, setMessage] = useState({
    make: "",
    model: "",
    mileage: "",
    color: "",
    fuelType: "",
    transmission: "",
    vehicleType: "",
    file: null,
  });

  useEffect(() => {
    if (divRef.current) {
      setIsReady(true)
      setMaxWidth(divRef.current.offsetWidth)
    }

    const handleSize = () => {
      if (divRef.current) {
        setIsReady(true)
        setMaxWidth(divRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleSize)

    return () => window.removeEventListener('resize', handleSize)

  }, [])

  useEffect(() => {
    if (loading || currentImageIndex) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }

  }, [loading, currentImageIndex])

  useEffect(() => {
    const toggle = (e) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    if (currentImageIndex !== null) {
      document.addEventListener("keydown", toggle);
    } else {
      document.removeEventListener("keydown", toggle);
    }

    return () => document.removeEventListener("keydown", toggle);
  }, [currentImageIndex]);

  const mileage = (e) => {
    setError((current) => {
      if (!isNaN(Number(e.target.value))) {
        return { ...current, mileage: e.target.value };
      }
      return { ...current, mileage: "" };
    });
  };

  const validateColor = (color) => {
    return validColorNames.includes(color.toLowerCase());
  };

  const handleColorChange = (e) => {
    const colorValue = e.target.value;
    if (validateColor(colorValue)) {
      setError((current) => {
        return { ...current, color: colorValue };
      });
      setMessage((current) => {
        return { ...current, color: "correct-add" };
      });
    } else {
      setError((current) => {
        return { ...current, color: "" };
      });
      setMessage((current) => {
        return { ...current, color: "error-add" };
      });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const newMessages = { ...message };
    for (let key in error) {
      if (!error[key]) {
        newMessages[key] = "error-add";
      } else {
        newMessages[key] = "correct-add";
      }
    }
    setMessage(newMessages); // Update the message state once with the new values
  };

  useEffect(() => {
    for (let key in message) {
      if (message[key] !== "correct-add") {
        return;
      }
    }

    const formdata = new FormData();

    for (const file1 of file) {
      formdata.append("files", file1);
    }
    formdata.append("dealer_id", id);
    for (let key in error) {
      formdata.append(key, error[key]);
    }

    setUnavailable(true);
    setLoading(true);
    const timeout=setTimeout(() => {
      setToMuchTime(true)
    }, 5000)

    axiosInstance
      .post("/cars", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if(res.data==='success')
          console.log('success')
        return;
        clearTimeout(timeout)
        setToMuchTime(false)
        setLoading(false);
        setUnavailable(false);
        navigate("/After-add");
      })
      .catch((err) => {
        clearTimeout(timeout)
        setToMuchTime(false)
        setLoading(false);
        console.log(err, 'hi');
        if (typeof err.response.data !== 'string') {
          setErrorMessage('Problems in te server')
          setUnavailable(false);
          setErrorClassName('add-error')
        }
        setTimeout(()=>setUnavailable(false),3000)
        setErrorClassName('add-error warning')
        setErrorMessage(err.response.data);
      });
  }, [message]);

  useEffect(() => {
    axiosInstance
      .get("/dealerMake", { params: { model, reqMake: value } })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllMake(res.data);
          return;
        }
        setAllMake([res.data]);
        setValue(res.data.make);
      })
      .catch((err) => console.log(err));
  }, [model]);


  useEffect(() => {
    axiosInstance
      .get("/dealerModel", { params: { make } })
      .then((res) => {
        setAllModel(res.data);
      })
      .catch((err) => console.log(err));
  }, [make]);

  useEffect(() => {
    axiosInstance.get("/transmission").then((res) => {
      setTransmission(res.data);
    });
  }, []);

  useEffect(() => {
    axiosInstance.get("/fuelType").then((res) => {
      setFuelType(res.data);
    });
  }, []);

  useEffect(() => {
    axiosInstance.get("/vehicleType").then((res) => {
      setVehicleType(res.data);
    });
  }, []);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setFile(files);
    setSelectedFileName(files.map((file) => file.name));
    setError((current) => {
      if (files.length) {
        return { ...current, file: "good" };
      } else {
        return { ...current, file: null };
      }
    });
  };

  const openModal = () => () => {
    setCurrentImageIndex(0);
  };

  const closeModal = (e) => {
    e.stopPropagation()
    setCurrentImageIndex(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % file.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + file.length) % file.length);
  };


  return (
    <>
      <button type='btn' onClick={() => navigate('/')} className="btn2 ">Home</button>
      <div className="div-box" ref={divRef} style={{ marginTop: '0px' }}>
        <form className="sell-menu" encType="multipart/form-data" onSubmit={submit}>
          <div style={{ display: "flex" }}>
            <div className="options">
              <p className="text">Make</p>
              <select
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError((current) => {
                    return { ...current, make: e.target.value };
                  });
                  setMake(e.target.value);
                }}
                className={`select sell ${message.make}`}
              >
                <option value="">Select</option>
                {allMake.map((use, index) => (
                  <option key={index} value={use.make}>
                    {use.make}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginLeft: "15px" }} className="options2">
              <p className="text3">Model</p>
              <select
                onChange={(e) => {
                  setError((current) => {
                    return { ...current, model: e.target.value };
                  });
                  setModel(e.target.value);
                }}
                className={`select sell gap ${message.model}`}
              >
                <option onChange={(e) => setModelValue(e.target.value)} value={modelValue}>
                  Select
                </option>
                {allModel.map((use, index) => (
                  <option key={index} value={use}>
                    {use}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div className="options">
              <p className="text">Mileage</p>
              <input
                placeholder="Km"
                onChange={mileage}
                className={`input-sell ${message.mileage}`}
              />
            </div>
            <div style={{ marginLeft: "15px" }} className="options2">
              <p className="text3">Color</p>
              <input
                type="text"
                onChange={handleColorChange}
                className={`input-sell ${message.color}`}
                placeholder="e.g., red, blue"
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div className="options" style={{ display: "flex", flexDirection: "column" }}>
              <p className="text">Transmission</p>
              <select
                onChange={(e) => {
                  setError((current) => {
                    return { ...current, transmission: e.target.value };
                  });
                }}
                className={`select sell ${message.transmission}`}
              >
                <option value="">Select</option>
                {transmission.map((use, index) => (
                  <option key={index} value={use}>
                    {capitalize(use.replaceAll("_", " "))}
                  </option>
                ))}
              </select>
            </div>
            <div className="options2">
              <p style={{ marginRight: "8px" }} className="text3">
                Fuel Type
              </p>
              <select
                onChange={(e) => {
                  setError((current) => {
                    return { ...current, fuelType: e.target.value };
                  });
                }}
                className={`select sell gap ${message.fuelType}`}
              >
                <option value="">Select</option>
                {fuelType.map((use, index) => (
                  <option key={index} value={use}>
                    {use}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div className="options">
              <p className="text">Vehicle Type</p>
              <select
                onChange={(e) => {
                  setError((current) => {
                    return { ...current, vehicleType: e.target.value };
                  });
                }}
                className={`select-vehicle ${message.vehicleType}`}
              >
                <option value="">Select</option>
                {vehicleType.map((use, index) => (
                  <option key={index} value={use}>
                    {use}
                  </option>
                ))}
              </select>
            </div>
            <div className="image-input">
              <p className="text3">Image</p>
              <label htmlFor="files" className={`input-sell image ${message.file}`}>
                Choose Files
                <input
                  id="files"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className=" label-input-sell"
                  onChange={handleFile}
                  multiple
                />
              </label>
              {selectedFileName.length > 0 && (
                <div className="file-div">
                  <p style={{ cursor: "pointer" }} onClick={openModal()} className="file-name">
                    Photos
                  </p>
                </div>
              )}
            </div>
          </div>
          {(errorMessage && isReady) && (
            <div>
              <p style={{ maxWidth: `${maxWidth - 50}px` }} className={errorClassName}>{errorMessage}</p>
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: "10px",
              pointerEvents: unavailable ? "none" : "auto",
              opacity: unavailable ? "0.5" : "1",
              cursor: unavailable ? "not-allowed" : "pointer",
            }}
            className="create"
          >
            Create
          </button>
        </form>

        {loading && (
          <div className="modal">
            <div className="loading-div">
              {toMuchTime ? <div>Sorry, this is taking longer than usual...</div> : <div>Please wait...</div>}
              <div className="loading"></div>

            </div>
          </div>
        )}

        {currentImageIndex !== null && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="close-div">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
              </div>
              <div className="image-div">
                <img
                  style={{ overflow: "hidden" }}
                  src={URL.createObjectURL(file[currentImageIndex])}
                  alt="Preview"
                />
              </div>
              <div className="modal-navigation">
                <button style={{fontSize:"24px"}} onClick={prevImage}>&lt;</button>
                <button style={{fontSize:"24px"}} onClick={nextImage}>&gt;</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
}
