import * as z from "zod";

export const taskSchema = z.object({
    task: z.string().min(1, "Can't be empty"),
});

export type TaskValues = z.infer<typeof taskSchema>;
