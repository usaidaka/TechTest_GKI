import React, { useState } from "react";
import { Alert } from "flowbite-react";

const AlertNotification = ({ color, msg, setMsg }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDismiss = () => {
    setIsOpen(false);
    setMsg("");
  };

  return (
    // <div className="absolute right-0 bottom-0 m-10">
    <>
      {isOpen && (
        <Alert color={color} onDismiss={handleDismiss}>
          <span className="font-medium">Info alert!</span> {msg}
        </Alert>
      )}
    </>
    // </div>
  );
};

export default AlertNotification;
