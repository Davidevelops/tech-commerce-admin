"use server";

import axios from "axios";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export const signUp = async (_: any, formData: FormData) => {
  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const middleName = formData.get("middleName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  try {
    const res = await axios.post(
      "https://tech-commerce-expressserver.onrender.com/api/account/signUp",
      {
        firstName,
        lastName,
        middleName,
        email,
        password,
      }
    );

    //payload
    const userId = res.data.user._id;
    const token = jwt.sign(
      {
        id: userId,
        role: "admin",
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
      },
      process.env.SECRET_KEY as string
    );

    const cookie = await cookies();
    cookie.set("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return { success: true, errors: {} };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }
  }
  return {
    success: false,
    errors: "An error occured. Try again later.",
  };
};

export const logIn = async (_: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  try {
    const res = await axios.post(
      "https://tech-commerce-expressserver.onrender.com/api/account/logIn",
      {
        email,
        password,
      }
    );

    //payload
    const user = res.data.account;
    const token = jwt.sign(
      {
        id: user._id,
        role: "admin",
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.SECRET_KEY as string
    );

    const cookie = await cookies();
    cookie.set("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return { success: true, errors: {}, redirect: "/orders" };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }
    return {
      success: false,
      errors: "Something went wrong. Try Again.",
    };
  }
};

export const logOut = async () => {
  const cookie = await cookies();
  cookie.set("jwt", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
  });

  return { success: true, errorrs: {} };
};

export const addProduct = async (_: any, formData: FormData) => {
  const productName = formData.get("productName")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const productPrice = formData.get("productPrice")?.toString();
  const productCategory = formData.get("productCategory")?.toString();
  const productImages = formData.getAll("productImages").map(String);
  const productSubCategory = formData.get("productSubCategory")?.toString();
  const rawProperties = formData.get("properties")?.toString();

  let properties: { name: string; value: string }[] = [];

  if (rawProperties) {
    try {
      properties = JSON.parse(rawProperties);
    } catch (error) {
      console.error(error);
    }
  }

  try {
    await axios.post(
      "https://tech-commerce-expressserver.onrender.com/api/account/addProduct",
      {
        productName,
        productDescription,
        productPrice,
        productCategory,
        productImages,
        productSubCategory,
        properties,
      }
    );

    return {
      success: true,
      errors: {},
    };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }
    return {
      success: false,
      errors: "Something went wrong. Try Again.",
    };
  }
};

export const updateProduct = async (_: any, formData: FormData) => {
  const productName = formData.get("productName")?.toString();
  const productDescription = formData.get("productDescription")?.toString();
  const productPrice = formData.get("productPrice")?.toString();
  const productId = formData.get("productId")?.toString();
  const productImages = formData.getAll("productImages").map(String);
  const productCategory = formData.get("productCategory")?.toString();
  const productSubCategory = formData.get("productSubCategory")?.toString();
  const rawProperties = formData.get("properties")?.toString();

  let properties: { name: string; value: string }[] = [];

  if (rawProperties) {
    try {
      properties = JSON.parse(rawProperties);
    } catch (error) {
      console.error(error);
    }
  }
  try {
    await axios.patch(
      `https://tech-commerce-expressserver.onrender.com/api/account/updateProduct/${productId}`,
      {
        productName,
        productDescription,
        productPrice,
        productImages,
        productCategory,
        productSubCategory,
        properties,
      }
    );
    return {
      success: true,
      errors: {},
    };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }
    return {
      success: false,
      errors: "Something went wrong. Try Again.",
    };
  }
};

export const addCategory = async (_: any, formData: FormData) => {
  const name = formData.get("name")?.toString();
  const parent = formData.get("parent")?.toString() || null;
  const rawProperties = formData.get("properties")?.toString();

  let properties: { name: string; value: string }[] = [];

  if (rawProperties) {
    try {
      properties = JSON.parse(rawProperties);
    } catch (error) {
      console.error("unable to parse properties");
    }
  }
  try {
    await axios.post(
      "https://tech-commerce-expressserver.onrender.com/api/account/addCategory",
      {
        name,
        parent,
        properties,
      }
    );

    return { success: true, errors: {} };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }

    return {
      success: false,
      errors: "Something went wrong. Try Again.",
    };
  }
};

export const editCategory = async (_: any, formData: FormData) => {
  const name = formData.get("name")?.toString();
  const parent = formData.get("category")?.toString();
  const categoryId = formData.get("categoryId")?.toString();
  const rawProperties = formData.get("properties")?.toString();

  let properties: { name: string; value: string }[] = [];

  if (rawProperties) {
    try {
      properties = JSON.parse(rawProperties);
    } catch (error) {
      console.error("unable to parse properties");
    }
  }

  try {
    await axios.patch(
      `https://tech-commerce-expressserver.onrender.com/api/account/editCategory/${categoryId}`,
      {
        name,
        parent,
        properties,
      }
    );
    return { success: true, errors: {} };
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        errors: error.response?.data?.errors,
      };
    }
    return {
      success: false,
      errors: "Something went wrong. Try Again.",
    };
  }
};
