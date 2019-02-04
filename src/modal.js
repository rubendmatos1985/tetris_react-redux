import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal-root");

const Modal = props => {
  const el = document.createElement("div");
  useLayoutEffect(() => {
    modalRoot.appendChild(el);
    return () => modalRoot.removeChild(el);
  });
  return createPortal(props.children, el);
};

export default Modal;
