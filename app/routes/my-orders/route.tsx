export default function MyOrders() {
  return (
    <main className="mt-32 flex flex-col items-center">
      <div className="w-[950px]">
        <div className="flex items-start gap-3">
          <h1 className="text-4xl font-bold tracking-wide">MY ORDERS</h1>
          {/* Total orders counter */}
          <p className="text-lg font-bold">[3]</p>
        </div>
      </div>
    </main>
  );
}
