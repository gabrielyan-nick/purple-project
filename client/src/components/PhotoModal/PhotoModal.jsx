import React, { useRef, useEffect } from "react";
import { IconButton, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";
import useOnClickOutside from "hooks/useOnClickOutside";
import "./styles.scss";

const PhotoModal = ({ image, alt = "post image", closeModal }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
  const imgRef = useRef(null);
  const modalRef = useRef(null);
  const outsideElements = [
    ...document.querySelectorAll("button"),
    ...document.querySelectorAll("input"),
  ];

  const getModalSize = () => {
    const img = imgRef.current;
    const modal = modalRef.current;
    modal.style.width = `${img.width}px`;
    modal.style.height = `${img.height}px`;
  };

  useEffect(() => {
    getModalSize();
    hiddenOutsideElements();
  }, [image]);

  useEffect(() => {
    window.addEventListener("resize", getModalSize);
    return () => {
      window.removeEventListener("resize", getModalSize);
    };
    
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
    
  }, []);

  const hiddenOutsideElements = () => {
    outsideElements.forEach((element) => {
      element.setAttribute("tabindex", "-1");
    });
  };

  const onCloseModal = () => {
    closeModal();
    outsideElements.forEach((element) => {
      if (
        !element.classList.contains("mobMenu-ref") &&
        !element.parentElement.classList.contains("mobMenu-ref-select") // Не трогаем tabindex бургер меню
      ) {
        element.setAttribute("tabindex", "0");
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onCloseModal();
    }
  };

  useOnClickOutside(modalRef, onCloseModal);

  return (
    <div className="photo-modal">
      <div
        className="photo-modal-content"
        ref={modalRef}
      >
        <img
          src={`http://localhost:3001/assets/${image}`}
          alt={alt}
          ref={imgRef}
          style={{ maxHeight: `${isNonMobileScreens ? "96vh" : "92vh"}` }}
        />
        <IconButton
          onClick={onCloseModal}
          size="small"
          style={{
            position: "absolute",
            top: `${isNonMobileScreens ? "-10px" : "-35px"}`,
            right: `${isNonMobileScreens ? "-40px" : "-10px"}`,
            color: "white",
          }}
        >
          <Close fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

export default PhotoModal;
