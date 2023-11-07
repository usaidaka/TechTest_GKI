import React from "react";

const Button = ({
  buttonUseFor,
  disabled = false,
  type = "button",
  buttonText = "Submit",
  isStroke = false,
  onClick,
}) => {
  let buttonDesign;

  switch (buttonUseFor) {
    case "confirm":
      buttonDesign = ` ${
        isStroke
          ? "bg-white box-border border-2 border-green-500 text-green-400  px-4 py-1.5"
          : "bg-green-500 text-white  px-4 py-2"
      }  `;
      break;
    case "danger":
      buttonDesign = ` ${
        isStroke
          ? "bg-white box-border border-2 border-red-500 text-red-500  px-4 py-1.5"
          : "bg-red-500 text-white  px-4 py-2"
      }  `;
      break;
    default:
      buttonDesign = ` ${
        isStroke
          ? "bg-white box-border border-2 border-blue-500 text-blue-500  px-4 py-1.5"
          : "bg-blue-500 text-white  px-4 py-2"
      }  `;
      break;
  }
  return (
    <div>
      <button
        type={type}
        className={buttonDesign}
        disabled={disabled}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Button;
