import { useEffect } from "react";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      console.log(event);
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        event.target.classList.contains("MuiBackdrop-root") ||
        event.target.classList.contains("MuiMenuItem-root")
        //  ||
        // event.target.classList.contains("MuiSvgIcon-root") ||
        // event.target.parentElement.classList.contains("MuiSvgIcon-root")
      )
        return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  });
};

export default useOnClickOutside;
