import React from "react";

function ProductStatusSelect({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <label
        className="font-medium text-[#00000099]"
        style={{ fontSize: "14px" }}
      >
        Status
      </label>
      <select
        name="activeStatus"
        value={value ? "Active" : "Inactive"}
        onChange={(e) =>
          onChange({
            target: {
              name: "activeStatus",
              type: "checkbox",
              checked: e.target.value === "Active",
            },
          })
        }
        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        style={{ color: "#000000" }}
        disabled={disabled}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}

export default ProductStatusSelect;
