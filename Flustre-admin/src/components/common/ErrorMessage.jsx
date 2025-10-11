import React from "react";

const ErrorMessage = ({ error }) =>
  error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;

export default ErrorMessage;
