"use client";
import React, { ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { addProduct } from "@/app/actions/action";
import axios from "axios";
import { useState } from "react";
import { Images, Trash2, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Properties = {
  name: string;
  value: string;
};
export default function AddProduct() {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [properties, setProperties] = useState<Properties[]>([]);
  const [subCategory, setSubCategory] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const router = useRouter();
  const [state, formAction] = useActionState(addProduct, {
    success: false,
    errors: {},
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Product added successfully");
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    }
  }, [state.success]);

  const uploadProductImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const imageUrls: string[] = [];

    if (files) {
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "e-commecre");
        try {
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dalbisegj/image/upload",
            data
          );
          imageUrls.push(res.data);
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    setImageUrl((prev) => [...prev, ...imageUrls]);
    try {
    } catch (error) {}
  };

  function addProperties() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }
  function handlePropertyNameChange(index: number, newName: string) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValueChange(index: number, newValue: string) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  }
  function removeProperty(index: number) {
    setProperties((prev) => {
      const properties = [...prev];
      return properties.filter((property, pIndex) => pIndex !== index);
    });
  }
  function removeImage(index: number) {
    setImageUrl((prev) => {
      const images = [...prev];
      return images.filter((image, imIndex) => imIndex !== index);
    });
  }
  return (
    <div className="w-full rounded h-full overflow-hidden">
      <Toaster position="top-center" />
      <div className="w-full p-6 flex flex-col md:flex-row gap-3 h-full">
        <div className="uploads-container flex p-2 w-full border rounded flex-col gap-2 overflow-y-scroll">
          <Label className="border-dashed border-2 border-blue-400 flex flex-col items-center justify-center w-[100%] bg-blue-50 text-blue-700 rounded text-xl gap-5 hover:cursor-pointer p-10">
            <Images size={80} />
            <p className="flex gap-1 items-center text-gray-500 text-center text-sm md:text-lg">
              upload your product images here
            </p>
            <input
              type="file"
              name="productImage"
              className="hidden"
              onChange={(e) => uploadProductImage(e)}
              disabled={imageUrl.length >= 4}
            />
          </Label>
          <div className="uploaded-images">
            {imageUrl &&
              imageUrl.map((url: any, index: number) => {
                const sizeInKB = (url.bytes / 1024).toFixed(2);

                return (
                  <div
                    key={index}
                    className="flex flex-col  md:flex-col lg:flex-row border items-center justify-between gap-2 p-3 mt-3"
                  >
                    <div className="product-details flex items-center flex-col  md:flex-col lg:flex-row justify-center">
                      {" "}
                      <img
                        src={url.secure_url}
                        alt="product"
                        className="w-[100px] h-[100px] rounded"
                      />
                      <div className="px-2 flex flex-col gap-3 justify-between text-center w-[100px] md:w-[150px] lg:w-full truncate">
                        <h2>
                          {url.original_filename}.{url.format}
                        </h2>
                        <p className="text-gray-400 text-center">
                          {sizeInKB}Kb
                        </p>
                      </div>
                    </div>

                    <div className="button-container p-3">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="border rounded p-1 bg-red-500 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <form
          className="flex flex-col gap-4 border rounded p-3 w-full overflow-y-scroll"
          action={formAction}
        >
          {imageUrl &&
            imageUrl.map((url: any, index) => (
              <Input
                name="productImages"
                value={url.secure_url}
                key={index}
                readOnly
                type="hidden"
              ></Input>
            ))}
          <div className="">
            <Input
              id="productName"
              placeholder="Product Name"
              name="productName"
            />
            {state.errors?.productName && (
              <p className="bg-red-200 text-red-800">
                {state.errors?.productName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Textarea
              id="productDescription"
              placeholder="Product Description"
              name="productDescription"
              rows={5}
            ></Textarea>
            {state.errors?.productDescription && (
              <p className="bg-red-200 text-red-800">
                {state.errors?.productDescription}
              </p>
            )}
          </div>
          <Select onValueChange={(val) => setCategory(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Main Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="wearable">Wearables</SelectItem>
              <SelectItem value="portable_audio">Portable Audio</SelectItem>
              <SelectItem value="laptop">Laptop</SelectItem>
              <SelectItem value="gaming_console">Gaming Console</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(val) => setSubCategory(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sub Category (Optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iphone">iPhone</SelectItem>
              <SelectItem value="ipad">iPad</SelectItem>
              <SelectItem value="macbook">MacBook</SelectItem>
              <SelectItem value="android">Android</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-1">
            <Input
              id="productPrice"
              type="number"
              min="1"
              placeholder="Price"
              name="productPrice"
            />
            {state.errors?.productPrice && (
              <p className="bg-red-200 text-red-800">
                {state.errors?.productPrice}
              </p>
            )}
          </div>
          <div className="flex-col gap-1 inline-block">
            <Button onClick={addProperties} type="button" className="mb-2">
              <CirclePlus /> Add Properties
            </Button>
            {properties &&
              properties.map((property, index) => (
                <div key={index} className="flex  gap-1 p-2">
                  <Input
                    type="text"
                    value={property.name}
                    placeholder="Property Name"
                    className="border"
                    onChange={(e) =>
                      handlePropertyNameChange(index, e.target.value)
                    }
                  ></Input>

                  <Input
                    type="text"
                    value={property.value}
                    placeholder="Property Value"
                    className="border"
                    onChange={(e) =>
                      handlePropertyValueChange(index, e.target.value)
                    }
                  ></Input>

                  <Button
                    className="bg-red-500 text-white font-semibold"
                    size={"sm"}
                    onClick={() => removeProperty(index)}
                    type="button"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            {state.errors?.productDescription && (
              <p className="bg-red-200 text-red-800">
                {state.errors?.productDescription}
              </p>
            )}
          </div>
          <input type="hidden" name="productSubCategory" value={subCategory} />
          <input type="hidden" name="productCategory" value={category} />
          <input
            type="hidden"
            name="properties"
            value={JSON.stringify(properties)}
          />
          <div className="button-container">
            <Button type="submit" className="w-full bg-blue-500">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
