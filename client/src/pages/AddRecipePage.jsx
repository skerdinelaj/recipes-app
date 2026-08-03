import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createRecipe } from '../api/api';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];

export default function AddRecipePage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }
    setSubmitting(true);
    try {
      await createRecipe({
        title: title.trim(),
        category,
        ingredients,
        instructions: instructions.trim(),
        createdBy: currentUser._id,
      });
      navigate('/recipes');
    } catch {
      setError('Failed to create recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/recipes')}
        className="text-amber-600 hover:text-amber-700 text-sm mb-6 flex items-center gap-1"
      >
        ← Back to recipes
      </button>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add a New Recipe</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Recipe title
            </label>
            <input
              type="text"
              placeholder="e.g. Fluffy Pancakes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    category === cat
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Ingredients
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. 2 cups flour"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Add
              </button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-100"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => removeIngredient(ing)}
                      className="text-amber-400 hover:text-amber-700 font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Instructions
            </label>
            <textarea
              placeholder="Describe the steps to prepare this recipe..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !category}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {submitting ? 'Publishing...' : 'Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}
