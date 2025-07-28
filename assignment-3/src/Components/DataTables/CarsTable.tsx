import { useEffect, useState } from "react";
import { getAll } from "../../lib/SupaBase/api/cars/getAll"
type Car = {
  id: string;
  Make: string;
  Model: string;
  Year: number;
};

export default function CarsTable() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    try {
      const data = await getAll();
      setCars(data);
    } catch (err) {
      console.error("Error loading cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars(); // initial fetch
    const interval = setInterval(loadCars, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cars List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <ul className="space-y-6">
          {cars.map((car) => (
            <li
              key={car.id}
              className="border p-4 rounded-lg shadow hover:bg-gray-50"
            >
              <div className="font-semibold text-lg">
                {car.Make} {car.Model} ({car.Year}) – ID: {car.id}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
