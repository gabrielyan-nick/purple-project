import React, { useRef, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { IconButton, useTheme, Box, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { FlexBetweenBox } from "components";
import useOnClickOutside from "hooks/useOnClickOutside";
import useMount from "hooks/useMount";
import "./styles.scss";

const Modal = ({ opened, closeModal, children }) => {
  const [animationIn, setAnimationIn] = useState(false);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const { mounted } = useMount({ opened });
  const { palette } = useTheme();

  useEffect(() => {
    setAnimationIn(opened);
  }, [opened]);

  useEffect(() => {
    if (opened) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [opened]);

  const handleKeyDown = (event) => {
    const modalElements = overlayRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = modalElements[0];
    const lastElement = modalElements[modalElements.length - 1];

    if (event.key === "Escape") {
      onCloseModal();
    }

    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    }
  };

  const onCloseModal = () => {
    closeModal();
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
      classNames="modal-overlay"
    >
      <div className="modal" ref={overlayRef}>
        <CSSTransition
          in={animationIn}
          nodeRef={contentRef}
          timeout={100}
          appear
          mountOnEnter
          unmountOnExit
          classNames="modal-content"
        >
          <div className="modal-content" ref={contentRef}>
            <Box
              sx={{
                backgroundColor: palette.modal.bg,
                borderRadius: "5px",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <Box
                display="flex"
                width="100%"
                justifyContent="flex-end"
                marginBottom="5px"
              >
                <IconButton onClick={onCloseModal} size="small">
                  <Close sx={{ "&:hover": { color: palette.primary.main } }} />
                </IconButton>
              </Box>
              <Box px="10px">
                {children}
                <Box mt="15px" display="flex" justifyContent="center">
                  <Button
                    sx={{
                      "&:hover": {
                        backgroundColor: "#032e21",
                      },
                      backgroundColor: "#034934",

                      color: "#fff",
                      width: "30%",
                    }}
                    variant="contained"
                    onClick={onCloseModal}
                  >
                    Ok
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

export default Modal;
