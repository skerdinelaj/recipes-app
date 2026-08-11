const {z} = require('zod');

const commentSchema = z.object({
    comment: z.string().min(1),
});

module.exports = { commentSchema };