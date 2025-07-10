import { getOrders, Order } from "@/lib/getOrders";
import { Package } from "lucide-react";

export default async function Orders() {
  const orders = await getOrders();

  return (
    <div className="grid gap-1 p-5">
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
              className="orders-container flex border-b-2 justify-between items-center p-3 flex-wrap gap-2"
              key={index}
            >
              <div className="icon bg-purple-600 rounded p-2">
                <Package size={60} color="white" />
              </div>
              <div className="w-[300px] md:text-end md:border-b-2 lg:text-start">
                {names.map((name, i) => (
                  <div key={i}>
                    <h1 className="font-bold text-lg">
                      {name} x {quantities[i]}
                    </h1>
                  </div>
                ))}
              </div>
              <div className="w-[250px]  sm:w-full md:w-full lg:w-[200px]">
                <h1 className="font-bold">{order.recipientName}</h1>
                <h1>{order.street}</h1>
                <h1>{order.barangay}</h1>
                <h1>{order.city}</h1>
                <h1>{order.province}</h1>
                <h1 className="font-bold">{order.recipientContact}</h1>
              </div>
              <div className="w-full sm:w-[100px] md:w-[100px]">
                <h1 className="font-bold">Total: {total.toFixed(2)}</h1>
              </div>
              <div>
                <h1 className="font-bold">MOP: COD</h1>
                <h1 className="font-bold">PAYMENT: PENDING</h1>
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
