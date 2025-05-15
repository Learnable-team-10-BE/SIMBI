import {z} from "zod";


export const mongoDbIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID must be a valid MongoDB ObjectId");

export const submitAnswerSchema = z.object({
    questionIndex: z.number().int().nonnegative("Question index must be a non-negative integer"),
    answer: z.string().nonempty("Answer is required").trim().max(500, "Answer must be at most 500 characters long"),
})


export type mongoDbIdSchemaInput = z.infer<typeof mongoDbIdSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;