interface Ingredient {
  name: string;
  quantity?: string;
}

interface PastRecipeCardProps {
  title: string;
  ingredients: Ingredient[];
}

export default function PastRecipeCard({ title, ingredients }: PastRecipeCardProps) {
  return (
    <div className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Ingredients:</span>{" "}
        {ingredients.map((ing) => ing.name).join(", ")}
      </p>
    </div>
  );
}
