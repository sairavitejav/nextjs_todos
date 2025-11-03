import {Schema, model, models} from 'mongoose';

export interface ITodo {
    title: string;
    completed: boolean;
    createdAt?: Date;
}

const TodoSchema = new Schema<ITodo>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Todo = models.Todo || model<ITodo>("Todo", TodoSchema);

export default Todo;