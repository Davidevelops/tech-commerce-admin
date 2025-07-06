import { getOrders, Order } from "@/lib/getOrders";
import { Package } from "lucide-react";

export default async function Orders() {
  const orders = await getOrders();

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-4xl font-bold">Orders</h1>
      {orders ? (
        orders.map((order: Order, index: number) => {
          const names = order.orderName[0].split(",") ?? [];
          const prices = order.orderPrice[0].split(",") ?? [];
          const quantities = order.orderQuantity[0].split(",") ?? [];
          const total = names.reduce((acc, item, i) => {
            return acc + Number(prices[i]) * Number(quantities[i]);
          }, 0);

          return (
            <div
              className="orders-container flex border-b-2 justify-between items-center p-3"
              key={index}
            >
              <div className="icon bg-purple-600 rounded p-2">
                <Package size={60} color="white" />
              </div>
              <div>
                {names.map((name, i) => (
                  <h1>
                    {name} x {quantities[i]}
                  </h1>
                ))}
              </div>
              <div>
                <h1>{order.recipientName}</h1>
                <h1>{order.street}</h1>
                <h1>{order.barangay}</h1>
                <h1>{order.city}</h1>
                <h1>{order.province}</h1>
                <h1>{order.recipientContact}</h1>
              </div>
              <div>
                <h1>{total.toFixed(2)}</h1>
              </div>
              <div>
                <h1>MOP: COD</h1>
                <h1>PAYMENT: PENDING</h1>
              </div>
            </div>
          );
        })
      ) : (
        <>No orders yet</>
      )}
    </div>
  );
}
