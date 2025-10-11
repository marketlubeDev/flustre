import { axiosInstance } from "../axios/axiosInstance";

export const getShipmentCharges = async () => {
    const response = await axiosInstance.get("utilities/get-utilites");
    return response.data;
};

export const updateShipmentCharges = async (data) => {
    const response = await axiosInstance.post(
        "utilities/update-delivery-charges",
        data
    );
    return response.data;
};
