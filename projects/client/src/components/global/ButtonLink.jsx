import React from "react";
import { Link } from "react-router-dom";

const ButtonLink = ({
  buttonUseFor,
  disabled = false,
  type = "button",
  buttonText = "Submit",
  isStroke = false,
  to,
}) => {
  let buttonDesign;

  switch (buttonUseFor) {
    default:
      buttonDesign = ` ${
        isStroke
          ? "bg-white box-border rounded-md border-2 border-blue-500 text-blue-500  px-4 py-1.5"
          : "bg-blue-500 text-white rounded-md  px-4 py-2"
      }  `;
      break;
  }
  return (
    <div>
      <Link type={type} className={buttonDesign} disabled={disabled} to={to}>
        {buttonText}
      </Link>
    </div>
  );
};

export default ButtonLink;
