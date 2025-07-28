import { useEffect, useState } from "react";
import { getAllCustomers } from "../../lib/SupaBase/api/customers/getAll";

type Customer = {
  id: string;
  Name: string;
};

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(); // initial fetch
    const interval = setInterval(loadCustomers, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul className="space-y-6">
          {customers.map((customer) => (
            <li
              key={customer.id}
              className="border p-4 rounded-lg shadow hover:bg-gray-50"
            >
              <div className="font-semibold text-lg">
                {customer.Name} (ID: {customer.id})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
