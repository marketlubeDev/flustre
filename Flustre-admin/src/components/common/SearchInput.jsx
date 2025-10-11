import React from "react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  iconSrc = "/icons/searchicon.svg",
  inputClassName = "w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none shadow-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-xs",
  containerClassName = "relative",
  ...inputProps
}) => {
  return (
    <div className={containerClassName}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <img src={iconSrc} alt="" className="h-4 w-4" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClassName}
        {...inputProps}
      />
    </div>
  );
};

export default SearchInput;
