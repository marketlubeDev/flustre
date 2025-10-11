import React from "react";

function PageHeader({ content, otherDetails, marginBottom = "mb-5" }) {
  return (
    <div
      // style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)" }}
      // className={`border border-base-300 p-3 bg-white ${marginBottom}`}
    >
      {/* <p className="font-bold text-xl">{content}</p>
      <p className="text-sm text-gray-500">{otherDetails}</p> */}
    </div>
  );
}

export default PageHeader;
