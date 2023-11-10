import React from "react";
import { FiSearch } from "react-icons/fi";

const InputSearch = ({ name, id, placeholder, onChange, onClick }) => {
  return (
    <div className="overflow-hidden flex justify-center items-center focus-within:border-cyan-600 focus-within:ring-cyan-600 rounded-lg border-2 w-full">
      <form action="" className="flex items-center w-full">
        <input
          type="text"
          name={name}
          id={id}
          className="border-transparent focus:border-transparent focus:ring-0 text-sm py-2 px-3 border-none w-full"
          placeholder={placeholder}
          onChange={onChange}
        />

        <button
          className="bg-white h-10 w-10 text-blue-600 ml-2 flex items-center justify-center"
          onClick={onClick}
        >
          <FiSearch />
        </button>
      </form>
    </div>
  );
};

export default InputSearch;
