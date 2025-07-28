// import React from 'react';
import sample1 from '../../assets/jsonData/sample1.json';

export default function RecipeDisplay() {
  const { title, description, ingredients, tools, steps } = sample1;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-yellow-50 border border-yellow-400 rounded-2xl shadow-inner p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-yellow-600">{title}</h2>
        <p className="text-gray-700 mt-2">{description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-yellow-500">🧂 Ingredients</h3>
        <ul className="list-disc list-inside mt-2 text-gray-800 space-y-1">
          {ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-yellow-500">🛠️ Tools Needed</h3>
        <ul className="list-disc list-inside mt-2 text-gray-800 space-y-1">
          {tools.map((tool, index) => (
            <li key={index}>{tool}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-yellow-500">👨‍🍳 Cooking Steps</h3>
        <ol className="list-decimal list-inside mt-2 text-gray-800 space-y-2">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
