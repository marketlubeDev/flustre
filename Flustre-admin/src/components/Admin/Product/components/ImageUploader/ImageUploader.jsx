import { FaImage } from "react-icons/fa";

const ImageUploader = ({
  index,
  image,
  handleClick,
  handleFileChange,
  fileInputs,
}) => (
  <div
    className="border border-dotted border-black h-52 flex flex-col justify-center items-center bg-[#E2E1E1] cursor-pointer"
    onClick={() => handleClick(index)}
    onChange={(e) => handleFileChange(e, index)}
  >
    {image ? (
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        className="w-full h-full object-contain"
      />
    ) : (
      <div>
        <FaImage className="text-gray-500 text-3xl" />
        <p className="text-blue-600 text-sm font-medium">Select Image</p>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      ref={(el) => (fileInputs.current[index] = el)}
    />
  </div>
);

export default ImageUploader;
