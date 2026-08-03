import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipes, getComments, createComment } from '../api/api';
import { useApp } from '../context/AppContext';

const CATEGORY_COLORS = {
  Breakfast: 'bg-yellow-100 text-yellow-700',
  Lunch: 'bg-green-100 text-green-700',
  Dinner: 'bg-blue-100 text-blue-700',
  Dessert: 'bg-pink-100 text-pink-700',
};

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [recipes, allComments] = await Promise.all([getRecipes(), getComments()]);
        const found = recipes.find((r) => r._id === id);
        if (!found) {
          setError('Recipe not found.');
          setLoading(false);
          return;
        }
        setRecipe(found);
        setComments(
          allComments.filter(
            (c) => c.recipeId?._id === id || c.recipeId === id
          )
        );
      } catch {
        setError('Could not load recipe.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment({
        comment: newComment.trim(),
        commentedBy: currentUser._id,
        recipeId: id,
      });
      setComments((prev) => [
        ...prev,
        {
          ...created,
          commentedBy: currentUser,
        },
      ]);
      setNewComment('');
    } catch {
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-20 text-red-400">
        {error || 'Recipe not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/recipes')}
        className="text-amber-600 hover:text-amber-700 text-sm mb-6 flex items-center gap-1"
      >
        ← Back to recipes
      </button>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
          <span className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[recipe.category]}`}>
            {recipe.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
            {recipe.createdBy?.name?.[0]}{recipe.createdBy?.surname?.[0]}
          </div>
          <span className="text-sm text-gray-400">
            By {recipe.createdBy?.name} {recipe.createdBy?.surname}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Ingredients
          </h2>
          <ul className="flex flex-col gap-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Instructions
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          💬 Comments ({comments.length})
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-1">
              {currentUser.name[0]}{currentUser.surname[0]}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this recipe..."
                rows={3}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none w-full"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="self-end bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
              >
                {submitting ? 'Posting...' : 'Post comment'}
              </button>
            </div>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">
            No comments yet. Be the first!
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {comments.map((c) => (
              <div key={c._id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {c.commentedBy?.name?.[0]}{c.commentedBy?.surname?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {c.commentedBy?.name} {c.commentedBy?.surname}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
