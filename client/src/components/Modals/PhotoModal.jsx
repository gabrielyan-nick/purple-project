import React, { useRef, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { IconButton, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";
import useOnClickOutside from "hooks/useOnClickOutside";
import useMount from "hooks/useMount";
import "./styles.scss";

const PhotoModal = ({ image, alt = "post image", opened, closeModal }) => {
  const [animationIn, setAnimationIn] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 700px)");
  const { mounted } = useMount({ opened });
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  const getModalSize = () => {
    const img = imgRef.current;
    const modal = contentRef.current;
    modal.style.width = `${img.width}px`;
    modal.style.height = `${img.height}px`;
  };

  useEffect(() => {
    setAnimationIn(opened);
  }, [opened]);

  useEffect(() => {
    if (opened) {
      getModalSize();
    }
  }, [image]);

  useEffect(() => {
    if (opened) {
      window.addEventListener("resize", getModalSize);
      return () => {
        window.removeEventListener("resize", getModalSize);
      };
    }
  }, []);

  useEffect(() => {
    if (opened) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [opened]);

  const onCloseModal = () => {
    closeModal();
  };

  const handleKeyDown = (event) => {
    const modalElements = overlayRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    if (event.key === "Escape") {
      onCloseModal();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      modalElements[0].focus();
    }
  };

  useOnClickOutside(contentRef, onCloseModal);

  if (!mounted) {
    return null;
  }

  return (
    <CSSTransition
      in={animationIn}
      nodeRef={overlayRef}
      timeout={100}
      appear
      mountOnEnter
      unmountOnExit
      classNames="photo-modal-overlay"
    >
      <div className="photo-modal-overlay" ref={overlayRef}>
        <div className="photo-modal-content" ref={contentRef}>
          <img
            src={image}
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
    </CSSTransition>
  );
};

export default PhotoModal;
