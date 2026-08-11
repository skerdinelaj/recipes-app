import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, getComments, createComment, deleteComment, updateComment, deleteRecipe, updateRecipe } from '../api/api';
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

  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [recipeDraft, setRecipeDraft] = useState(null);
  const [savingRecipe, setSavingRecipe] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [savingCommentId, setSavingCommentId] = useState(null);

  const isOwner = currentUser && recipe && currentUser._id === recipe.createdBy?._id;

  useEffect(() => {
    async function load() {
      try {
        const [recipeComments, recipeDetails] = await Promise.all([getComments(id), getRecipeById(id)]);
        setRecipe(recipeDetails);
        setComments(recipeComments);
      } catch (err) {
        if (err.message === 'RECIPE_NOT_FOUND') {
          setError("This recipe doesn't exist or may have been removed.");
        } else {
          setError('Could not load recipe.');
        }
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

  const startEditRecipe = () => {
    setRecipeDraft({
      title: recipe.title,
      category: recipe.category,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions,
    });
    setIsEditingRecipe(true);
  };

  const cancelEditRecipe = () => {
    setIsEditingRecipe(false);
    setRecipeDraft(null);
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    setSavingRecipe(true);
    try {
      const updated = await updateRecipe(id, {
        title: recipeDraft.title.trim(),
        category: recipeDraft.category,
        ingredients: recipeDraft.ingredients.split('\n').map((i) => i.trim()).filter(Boolean),
        instructions: recipeDraft.instructions.trim(),
      });
      setRecipe((prev) => ({ ...prev, ...updated }));
      setIsEditingRecipe(false);
      setRecipeDraft(null);
    } catch {
      alert('Failed to update recipe.');
    } finally {
      setSavingRecipe(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      await deleteRecipe(id);
      navigate('/recipes');
    } catch {
      alert('Failed to delete recipe.');
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setCommentDraft(comment.comment);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setCommentDraft('');
  };

  const handleSaveComment = async (commentId) => {
    if (!commentDraft.trim()) return;
    setSavingCommentId(commentId);
    try {
      const updated = await updateComment(commentId, { comment: commentDraft.trim() });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, comment: updated.comment } : c))
      );
      setEditingCommentId(null);
      setCommentDraft('');
    } catch {
      alert('Failed to update comment.');
    } finally {
      setSavingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('Failed to delete comment.');
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
        {isEditingRecipe ? (
          <form onSubmit={handleSaveRecipe} className="flex flex-col gap-4">
            <input
              value={recipeDraft.title}
              onChange={(e) => setRecipeDraft((d) => ({ ...d, title: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Title"
            />
            <select
              value={recipeDraft.category}
              onChange={(e) => setRecipeDraft((d) => ({ ...d, category: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Ingredients (one per line)
              </label>
              <textarea
                value={recipeDraft.ingredients}
                onChange={(e) => setRecipeDraft((d) => ({ ...d, ingredients: e.target.value }))}
                rows={5}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Instructions
              </label>
              <textarea
                value={recipeDraft.instructions}
                onChange={(e) => setRecipeDraft((d) => ({ ...d, instructions: e.target.value }))}
                rows={5}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none w-full"
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={cancelEditRecipe}
                className="text-sm font-medium px-5 py-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingRecipe}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
              >
                {savingRecipe ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[recipe.category]}`}>
                  {recipe.category}
                </span>
                {isOwner && (
                  <>
                    <button
                      onClick={startEditRecipe}
                      className="text-xs font-medium text-gray-500 hover:text-amber-600 px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteRecipe}
                      className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 py-1"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
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
          </>
        )}
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
            {comments.map((c) => {
              const isCommentOwner = currentUser && currentUser._id === c.commentedBy?._id;
              const isEditingThis = editingCommentId === c._id;
              return (
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
                      {isCommentOwner && !isEditingThis && (
                        <>
                          <button
                            onClick={() => startEditComment(c)}
                            className="text-xs font-medium text-gray-400 hover:text-amber-600 ml-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            className="text-xs font-medium text-gray-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                    {isEditingThis ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={commentDraft}
                          onChange={(e) => setCommentDraft(e.target.value)}
                          rows={2}
                          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none w-full"
                        />
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={cancelEditComment}
                            className="text-xs font-medium text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveComment(c._id)}
                            disabled={savingCommentId === c._id || !commentDraft.trim()}
                            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-medium px-4 py-1 rounded-full transition-colors"
                          >
                            {savingCommentId === c._id ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">{c.comment}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
