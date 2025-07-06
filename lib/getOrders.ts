import axios from "axios";
import { Types } from "mongoose";

export type Order = {
  _id?: Types.ObjectId;
  orderName: string[];
  orderQuantity: string[];
  orderPrice: string[];
  street: string;
  city: string;
  barangay: string;
  province: string;
  total: string;
  recipientName: string;
  recipientContact: string;
  createdAt: string;
  __v?: number;
};

export async function getOrders() {
  try {
    let res = await axios.get("http://localhost:5000/api/account/getOrders");
    return res.data.orders;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Status: ", error.response?.status);
      console.log("Message: ", error.response?.data);
    }
  }
}
