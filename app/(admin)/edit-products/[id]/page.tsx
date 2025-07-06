"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { toast, Toaster } from "sonner";
import { updateProduct } from "@/app/actions/action";
import { useParams } from "next/navigation";
import { Upload, Trash2, Images, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Property = {
  name: string;
  value: string;
};

export type Product = {
  productName: string;
  productDescription: string;
  productPrice: number;
  productImages?: string[];
  productCategory: string;
  productSubCategory: string;
  properties: Property[];
};

export default function EditProduct() {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    productName: "",
    productDescription: "",
    productPrice: 0,
    productImages: [],
    productCategory: "",
    productSubCategory: "",
    properties: [],
  });
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, formAction] = useActionState(updateProduct, {
    success: false,
    errors: {},
  });

  const { id } = useParams();

  useEffect(() => {
    if (state.success) {
      toast.success("Product updated successfully");
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    }
  }, [state.success]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/account/getProduct/${id}`
        );
        const data = res.data.product;
        setProduct({
          productName: data.productName,
          productDescription: data.productDescription,
          productPrice: data.productPrice,
          productImages: data.productImages || [],
          productCategory: data.productCategory,
          productSubCategory: data.productSubCategory,
          properties: data.properties || [],
        });
        setUrls(data.productImages || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred. Try again."
        );
      }
    };

    if (id) getProduct();
  }, [id]);

  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const newUrls: string[] = [];
    if (files) {
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "e-commecre");
        setLoading(true);
        try {
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dalbisegj/image/upload",
            data
          );
          newUrls.push(res.data.secure_url);
        } catch (error) {
          console.error(error);
        }
      }
    }
    setUrls((prev) => [...prev, ...newUrls]);
    setLoading(false);
  };

  const handlePropertyNameChange = (index: number, newName: string) => {
    setProduct((prev) => ({
      ...prev,
      properties: prev.properties.map((prop, i) =>
        i === index ? { ...prop, name: newName } : prop
      ),
    }));
  };

  const handlePropertyValueChange = (index: number, newValue: string) => {
    setProduct((prev) => ({
      ...prev,
      properties: prev.properties.map((prop, i) =>
        i === index ? { ...prop, value: newValue } : prop
      ),
    }));
  };

  const removeProperty = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index),
    }));
  };

  const addProperties = () => {
    setProduct((prev) => ({
      ...prev,
      properties: [...prev.properties, { name: "", value: "" }],
    }));
  };

  const removeImage = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (product?.productCategory || product?.productSubCategory) {
      setCategory(product.productCategory);
      setSubCategory(product.productSubCategory);
    }
  }, [product]);

  return (
    <div className="w-full h-full overflow-hidden">
      <Toaster position="top-center" />
      <div className="w-full p-6 flex gap-3 h-full">
        <div className="uploads-container flex p-2 w-full border rounded flex-col gap-2 overflow-y-scroll">
          <Label className="border-dashed border-2 border-blue-400 flex flex-col items-center justify-center w-[100%] bg-blue-50 text-blue-700 rounded text-xl gap-5 hover:cursor-pointer p-10">
            <Images size={100} />
            <p className="flex gap-1 items-center text-gray-500">
              <Upload />
              Upload new product images
            </p>
            <input
              type="file"
              name="productImage"
              className="hidden"
              onChange={(e) => uploadImages(e)}
            />
          </Label>
          <div className="uploaded-images">
            {urls.map((url: any, index) => (
              <div
                key={index}
                className="flex border items-center justify-between gap-1 p-3 mt-2"
              >
                <div className="product-details flex items-center justify-center">
                  <img
                    src={url}
                    alt="product"
                    className="w-[100px] h-[100px] rounded"
                  />
                  <div className="px-2 flex flex-col gap-3 justify-between">
                    <h2>
                      {url.original_filename} {index + 1}
                    </h2>
                  </div>
                </div>
                <div className="button-container p-3">
                  <button type="button" onClick={() => removeImage(index)}>
                    <Trash2 size={28} />
                  </button>
                </div>
              </div>
            ))}
            {loading && <p>Uploading...</p>}
          </div>
        </div>

        <form
          className="flex flex-col gap-4 border rounded p-3 w-full h-full overflow-y-scroll"
          action={formAction}
        >
          {urls.map((url, index) => (
            <input
              key={index}
              type="text"
              className="hidden"
              value={url}
              readOnly
              name="productImages"
            />
          ))}
          <input
            type="text"
            defaultValue={id}
            className="hidden"
            name="productId"
          />

          <Input
            id="productName"
            placeholder="Product Name"
            name="productName"
            defaultValue={product.productName}
          />
          {state.errors?.productName && (
            <p className="bg-red-200 text-red-800">
              {state.errors.productName}
            </p>
          )}

          <Textarea
            id="productDescription"
            placeholder="Product Description"
            name="productDescription"
            rows={5}
            defaultValue={product.productDescription}
          />
          {state.errors?.productDescription && (
            <p className="bg-red-200 text-red-800">
              {state.errors.productDescription}
            </p>
          )}

          <Select value={category} onValueChange={(val) => setCategory(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Main Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="wearable">Wearables</SelectItem>
              <SelectItem value="portable_audio">Portable Audio</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={subCategory}
            onValueChange={(val) => setSubCategory(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={product.productSubCategory} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iphone">iPhone</SelectItem>
              <SelectItem value="android">Android</SelectItem>
            </SelectContent>
          </Select>

          <Input
            id="productPrice"
            type="number"
            min="1"
            placeholder="Price"
            name="productPrice"
            defaultValue={product.productPrice}
          />
          {state.errors?.productPrice && (
            <p className="bg-red-200 text-red-800">
              {state.errors.productPrice}
            </p>
          )}

          <div className="flex-col gap-1 inline-block">
            <Button onClick={addProperties} type="button" className="mb-2">
              <CirclePlus /> Add Properties
            </Button>
            {product.properties.map((property, index) => (
              <div key={index} className="flex gap-1 p-2">
                <Input
                  type="text"
                  value={property.name}
                  placeholder="Property Name"
                  onChange={(e) =>
                    handlePropertyNameChange(index, e.target.value)
                  }
                />
                <Input
                  type="text"
                  value={property.value}
                  placeholder="Property Value"
                  onChange={(e) =>
                    handlePropertyValueChange(index, e.target.value)
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-red-500 text-white font-semibold"
                  onClick={() => removeProperty(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>

          <div className="button-container">
            <input type="hidden" name="productCategory" value={category} />
            <input
              type="hidden"
              name="productSubCategory"
              value={subCategory}
            />
            <input
              type="hidden"
              name="properties"
              value={JSON.stringify(product.properties)}
            />
            <Button type="submit" className="w-full bg-blue-500">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">Error: {error}</p>}
    </div>
  );
}
