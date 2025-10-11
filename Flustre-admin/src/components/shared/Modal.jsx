import React from "react";

export const Modal = ({ children, ...props }) => {
  // export const Modal = ({ isOpen, onClose, onSubmit, initialAddress, children }) => {

  // Add effect to control body scroll when modal opens/closes
  React.useEffect(() => {
    if (props?.isOpen) {
      // Disable scrolling on the body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup function to ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props?.isOpen]);

  //handle backdrop click
  const handleBackdropClick = (e) => {
    // e.preventDefault();
    if (e.target === e.currentTarget) {
      props?.onClose();
    }
  };

  return (
    props?.isOpen && (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-10   backdrop-blur-sm drop-shadow-lg shadow-2xl px-8 bg-opacity-50 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))",
        }}
      >
        <div
          className="transform md:translate-x-1/4 translate-y-10   bg-white shadow-2xl max-h-[90vh]  drop-shadow-2xl rounded-lg p-6 w-full max-w-lg overflow-y-auto"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          <button
            onClick={props?.onClose}
            className="absolute text-2xl top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
          {/* {React.cloneElement(children, { onClose: props?.onClose })} */}
          {children}
        </div>
      </div>
    )
  );
};
