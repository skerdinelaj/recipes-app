import { useState, useEffect } from 'react';
import { getRecipes, getComments } from '../api/api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [r, c] = await Promise.all([getRecipes(), getComments()]);
        setRecipes(r);
        setComments(c);
      } catch {
        setError('Could not load recipes. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? recipes
      : recipes.filter((r) => r.category === activeCategory);

  const commentCountFor = (recipeId) =>
    comments.filter((c) => c.recipeId?._id === recipeId || c.recipeId === recipeId).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
        <p className="text-gray-400 mt-1">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} shared by the community
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-amber-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading recipes...</div>
      )}

      {error && (
        <div className="text-center py-20 text-red-400">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No recipes in this category yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            commentCount={commentCountFor(recipe._id)}
          />
        ))}
      </div>
    </div>
  );
}
