const {z} = require('zod');

const recipeSchema = z.object({
    title: z.string().min(2).max(100),
    category: z.enum(["Breakfast", "Lunch", "Dinner", "Dessert"]),
    ingredients: z.array(z.string().min(1)).min(1),
    instructions: z.string().min(20),
});

module.exports = { recipeSchema };