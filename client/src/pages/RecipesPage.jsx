import { useState, useEffect } from 'react';
import { getRecipes, getComments } from '../api/api';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
const PAGE_SIZE = 6;

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getComments()
      .then(setComments)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await getRecipes({
          category: activeCategory === 'All' ? undefined : activeCategory,
          search,
          page,
          limit: PAGE_SIZE,
          sort,
        });
        if (cancelled) return;
        setRecipes(r.recipes);
        setTotalRecipes(r.totalRecipes);
        setTotalPages(r.TotalPAges);
        setError('');
      } catch {
        if (!cancelled) setError('Could not load recipes. Make sure the backend is running.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, search, page, sort]);

  const commentCountFor = (recipeId) =>
    comments.filter((c) => c.recipeId?._id === recipeId || c.recipeId === recipeId).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
        <p className="text-gray-400 mt-1">
          {totalRecipes} recipe{totalRecipes !== 1 ? 's' : ''} shared by the community
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search recipes by title..."
          className="w-full sm:w-80 px-4 py-2 rounded-full text-sm border border-gray-200 focus:outline-none focus:border-amber-300"
        />
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-500 focus:outline-none focus:border-amber-300"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
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

      {!loading && !error && recipes.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No recipes found.
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                commentCount={commentCountFor(recipe._id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-500 border border-gray-200 hover:border-amber-300 disabled:opacity-40 disabled:hover:border-gray-200"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-500 border border-gray-200 hover:border-amber-300 disabled:opacity-40 disabled:hover:border-gray-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
