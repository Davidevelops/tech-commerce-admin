"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { getProducts } from "@/lib/getProducts";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/account/deleteProduct/${id}`
      );
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href="/add-products">
          <Button className="flex gap-2 items-center">
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price (₱)</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell className="max-w-sm truncate text-sm text-muted-foreground">
                    {product.productDescription}
                  </TableCell>
                  <TableCell>
                    ₱{product.productPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-center gap-2">
                      <Link href={`/edit-products/${product._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex gap-1 items-center"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger className="flex gap-1 items-center bg-red-500 rounded p-1 text-white font-semibold">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete product from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product._id)}
                              className="flex gap-1 items-center bg-red-500 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
