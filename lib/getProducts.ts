"use server";
import axios from "axios";
export const getProducts = async () => {
  try {
    const res = await axios.get(
      "https://tech-commerce-expressserver.onrender.com/api/account/getProducts"
    );
    return res.data.products;
  } catch (error) {
    console.error(error);
    return [];
  }
};
