import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

import {supabase} from "../supabase/supabase";

import {TodoLoading} from "@/components/todo-loading";
import {TaskValues, taskSchema} from "@/schemas/task-schema";
import {useLoginStore} from "@/store/login-store";

interface Tasks {
    id_user: string;
    id_task: string;
    task: string;
    completed: boolean;
}

enum ACTIONS {
    ALL = 1,
    ACTIVE = 2,
    COMPLETED = 3,
}

export function Todo() {
    const [todos, setTodos] = useState<Tasks[] | null>([]);
    const [activeAction, setActiveAction] = useState(1);
    const [filteredTasks, setFilteredTasks] = useState<Tasks[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const session = useLoginStore((state) => state.session);
    const checkUser = useLoginStore((state) => state.checkUser);
    const logout = useLoginStore((state) => state.logout);

    const methods = useForm<TaskValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            task: "",
        },
    });

    const incompleteCount = todos?.filter((todo) => !todo.completed).length;

    const messagesEndRef = useRef<HTMLUListElement>(null);

    const addTodo = async (values: TaskValues) => {
        try {
            const currentUser = await supabase.auth.getUser();

            await supabase.from("tasks").insert({
                task: values.task.trim(),
                id_user: currentUser.data.user?.id,
            });
            toast.success("Task added successfully");
        } catch (error) {
            toast.error("An error ocurred while creating the task");
        }
        await getTasks();
        methods.reset();
    };

    const getTasks = async () => {
        const currentUser = await supabase.auth.getUser();
        const {data} = await supabase.from("tasks").select().eq("id_user", currentUser.data.user?.id);

        setTodos(data);
        setLoading(false);
    };

    const deleteTask = async (id: string) => {
        const {error} = await supabase.from("tasks").delete().eq("id_task", id);

        if (error) {
            toast.error("An error ocurred while deleting a task");
        } else {
            await getTasks();
            toast.success("The task was successfully deleted");
        }
    };

    const toggleCompleted = async (id: string, completed: boolean) => {
        await supabase.from("tasks").update({completed: !completed}).eq("id_task", id);
        await getTasks();
    };

    const clearCompleted = async () => {
        if (!todos) return;
        const currentTodo = todos.filter((todo) => todo.completed).map((todo) => todo.id_task);

        if (currentTodo.length === 0) {
            toast.error("Don't have completed tasks");

            return;
        }
        const {error} = await supabase.from("tasks").delete().in("id_task", currentTodo);

        if (error) {
            toast.error("An error ocurred while clear completed tasks");
        } else {
            await getTasks();
            toast.success("Completed tasks was successfully removed");
        }
    };

    const showActive = () => {
        const tasks = todos?.filter((todo) => !todo.completed);

        setFilteredTasks(tasks);
    };

    const showCompleted = () => {
        const tasks = todos?.filter((todo) => todo.completed);

        setFilteredTasks(tasks);
    };

    const handleClick = (click: number) => {
        setActiveAction(click);

        const actions: {[ref: number]: () => void} = {
            1: () => setFilteredTasks(undefined),
            2: showActive,
            3: showCompleted,
        };

        actions[click]();
    };

    useEffect(() => {
        getTasks();
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messagesEndRef.current?.scrollHeight]);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    useEffect(() => {
        const pendingTodo = todos?.filter((todo) => !todo.completed);

        if (!pendingTodo) return;

        document.title = pendingTodo.length > 0 ? `(${pendingTodo?.length}) To Do` : "To Do";
    }, [todos]);

    return (
        <div className="flex flex-col items-center gap-2 py-4 -mt-3">
            <div className="flex items-center justify-center w-full gap-3">
                <div className="flex items-center gap-2">
                    <img
                        alt="user avatar"
                        className="w-10 h-10 rounded-full"
                        src={session?.user.user_metadata.picture}
                    />
                    <span className="font-semibold">{session?.user.user_metadata.name}</span>
                </div>
                <i
                    className="mt-1 text-gray-300 cursor-pointer fa-solid fa-right-from-bracket hover:text-red-600"
                    onClick={logout}
                />
            </div>
            <section
                className="justify-between flex flex-col items-center min-h-[500px] border-2 border-white/20 bg-transparent w-[350px] p-4 rounded-3xl text-white gap-2 backdrop-blur-[25px]"
                style={{boxShadow: "0 0 10px rgba(0, 0, 0, .2)"}}
            >
                <form className="flex w-full" onSubmit={methods.handleSubmit(addTodo)}>
                    <input
                        autoComplete="off"
                        {...methods.register("task")}
                        className={`${
                            methods.formState.errors.task
                                ? "border-red-500 placeholder:text-red-300 border-r-transparent"
                                : "border-white/20 placeholder:text-gray-300"
                        } bg-transparent border-2 w-full px-3 py-1 text-sm rounded-l-3xl outline-none`}
                        placeholder={`${
                            methods.formState.errors.task ? methods.formState.errors.task.message : "Write your task..."
                        }`}
                        spellCheck="false"
                        type="text"
                    />
                    <button className="pl-2 pr-3 text-sm font-semibold -ml-[2px] bg-teal-600 rounded-r-3xl">Add</button>
                </form>
                <ul ref={messagesEndRef} className="scroll-smooth w-full h-full max-h-[410px] overflow-auto px-1">
                    {todos && todos.length > 0 ? (
                        (filteredTasks ? filteredTasks : todos).map((todo) => (
                            <li key={todo.id_task} className="flex items-baseline justify-between h-auto">
                                <div className="flex items-start gap-2">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => toggleCompleted(todo.id_task, todo.completed)}
                                    >
                                        {todo.completed ? (
                                            <i className="text-green-400 fa-solid fa-circle-check" />
                                        ) : (
                                            <i className="fa-light fa-circle" />
                                        )}
                                    </div>
                                    <span
                                        className={`${
                                            todo.completed ? "line-through text-gray-300" : ""
                                        } max-w-[230px] break-words leading-[1.3rem]`}
                                    >
                                        {todo.task}
                                    </span>
                                </div>
                                <i
                                    className="text-sm cursor-pointer fa-solid fa-trash-can hover:text-red-500"
                                    onClick={() => deleteTask(todo.id_task)}
                                />
                            </li>
                        ))
                    ) : (
                        <TodoLoading loading={loading} />
                    )}
                </ul>
                <footer className="flex items-center justify-between w-full text-xs text-gray-300 bottom-2">
                    <span>
                        {incompleteCount} Item{incompleteCount !== 1 ? "s" : ""} Left
                    </span>
                    <div className="flex gap-1">
                        <button
                            className={`${
                                activeAction === ACTIONS.ALL ? "text-white" : ""
                            } cursor-pointer hover:text-white`}
                            onClick={() => handleClick(1)}
                        >
                            All
                        </button>
                        <button
                            className={`${
                                activeAction === ACTIONS.ACTIVE ? "text-white" : ""
                            } cursor-pointer hover:text-white`}
                            onClick={() => handleClick(2)}
                        >
                            Active
                        </button>
                        <button
                            className={`${
                                activeAction === ACTIONS.COMPLETED ? "text-white" : ""
                            } cursor-pointer hover:text-white`}
                            onClick={() => handleClick(3)}
                        >
                            Completed
                        </button>
                    </div>
                    <div className="cursor-pointer hover:text-white" onClick={clearCompleted}>
                        Clear Completed
                    </div>
                </footer>
            </section>
        </div>
    );
}
