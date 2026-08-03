import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = {
  Breakfast: 'bg-yellow-100 text-yellow-700',
  Lunch: 'bg-green-100 text-green-700',
  Dinner: 'bg-blue-100 text-blue-700',
  Dessert: 'bg-pink-100 text-pink-700',
};

const CATEGORY_EMOJI = {
  Breakfast: '🌅',
  Lunch: '🥗',
  Dinner: '🍽️',
  Dessert: '🍰',
};

export default function RecipeCard({ recipe, commentCount }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-gray-900 font-semibold text-lg leading-tight">
          {recipe.title}
        </h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[recipe.category]}`}>
          {CATEGORY_EMOJI[recipe.category]} {recipe.category}
        </span>
      </div>

      <p className="text-gray-500 text-sm line-clamp-2">
        {recipe.instructions}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
            {recipe.createdBy?.name?.[0]}{recipe.createdBy?.surname?.[0]}
          </div>
          <span className="text-xs text-gray-400">
            {recipe.createdBy?.name} {recipe.createdBy?.surname}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          💬 {commentCount} comment{commentCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
