"use server";
import axios from "axios";
export const getProducts = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/account/getProducts"
    );
    return res.data.products;
  } catch (error) {
    console.error(error);
    return [];
  }
};
