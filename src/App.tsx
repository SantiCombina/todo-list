import {FormEvent, useEffect, useRef, useState} from "react";

import {useLoginStore} from "./store/login-store";

interface Tasks {
    id: string;
    text: string;
    completed: boolean;
}

function App() {
    const [todos, setTodos] = useState<Tasks[]>([]);

    const loginGoogle = useLoginStore((state) => state.loginGoogle);
    const session = useLoginStore((state) => state.session);
    const checkUser = useLoginStore((state) => state.checkUser);
    const logout = useLoginStore((state) => state.logout);

    const incompleteCount = todos.filter((todo) => !todo.completed).length;

    const messagesEndRef = useRef<HTMLUListElement>(null);

    const addTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.target) return;

        const inputElement = e.currentTarget.elements[0] as HTMLInputElement;
        const newTaskText = inputElement.value.trim();

        if (newTaskText === "") {
            // La tarea está vacía, se podría mostrar una alerta
            return;
        }

        setTodos([
            ...todos,
            {
                id: crypto.randomUUID(),
                text: newTaskText,
                completed: false,
            },
        ]);

        e.currentTarget.reset();
    };

    const toggleCompleted = (id: string) => {
        const currentTodo = todos.map((todo) => (todo.id === id ? {...todo, completed: !todo.completed} : todo));

        setTodos(currentTodo);
    };

    const deleteTask = (id: string) => {
        const currentTodo = todos.filter((todo) => todo.id !== id);

        setTodos(currentTodo);
    };

    const clearCompleted = () => {
        const currentTodo = todos.filter((todo) => !todo.completed);

        setTodos(currentTodo);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messagesEndRef.current?.scrollHeight]);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    return (
        <div className="flex flex-col items-center justify-between max-w-screen h-screen gap-2 bg-[#fefdfc]">
            <span />
            <div className="flex flex-col items-center gap-2 py-4 -mt-3">
                {session ? (
                    <button className="hover:bg-[#f5f5dc] px-4 rounded-lg" onClick={logout}>
                        Logout
                    </button>
                ) : (
                    <button className="hover:bg-[#f5f5dc] px-4 rounded-lg" onClick={loginGoogle}>
                        Login
                    </button>
                )}
                {session && (
                    <div className="flex items-center gap-2">
                        <img
                            alt="user avatar"
                            className="w-10 h-10 rounded-full"
                            src={session?.user.user_metadata.picture}
                        />
                        <span className="font-semibold">{session?.user.user_metadata.name}</span>
                    </div>
                )}
                <section className="justify-between flex flex-col items-center min-h-[500px] bg-black/80 w-[320px] p-4 rounded-lg text-white gap-2">
                    <form className="flex w-full" onSubmit={addTodo}>
                        <input
                            className="w-full px-3 py-1 text-sm text-black rounded-l-lg outline-none"
                            placeholder="Write your task..."
                            spellCheck="false"
                            type="text"
                        />
                        <button className="px-2 text-sm font-semibold bg-[#256d7b] rounded-r-lg">Add</button>
                    </form>
                    <ul ref={messagesEndRef} className="scroll-smooth w-full h-full max-h-[410px] overflow-auto px-1">
                        {todos.length > 0 ? (
                            todos?.map((todo) => (
                                <li key={todo.id} className="flex items-baseline justify-between h-auto">
                                    <div className="flex items-start gap-2">
                                        <div className="cursor-pointer" onClick={() => toggleCompleted(todo.id)}>
                                            {todo.completed ? (
                                                <i className="text-green-500 fa-solid fa-circle-check" />
                                            ) : (
                                                <i className="fa-light fa-circle" />
                                            )}
                                        </div>
                                        <span
                                            className={`${
                                                todo.completed ? "line-through text-gray-300" : ""
                                            } max-w-[230px] break-words leading-[1.3rem]`}
                                        >
                                            {todo.text}
                                        </span>
                                    </div>
                                    <i
                                        className="text-sm cursor-pointer fa-solid fa-trash-can hover:text-red-500"
                                        onClick={() => deleteTask(todo.id)}
                                    />
                                </li>
                            ))
                        ) : (
                            <li className="flex items-center justify-center h-full gap-2 text-sm text-gray-400">
                                <i className="fa-solid fa-list" />
                                Your to-do list is waiting!
                            </li>
                        )}
                    </ul>
                    <footer className="flex items-center justify-between w-full text-xs text-gray-400 bottom-2">
                        <span>
                            {incompleteCount} Item{incompleteCount !== 1 ? "s" : ""} Left
                        </span>
                        <div className="cursor-pointer hover:text-white">All Active Completed</div>
                        <div className="cursor-pointer hover:text-white" onClick={clearCompleted}>
                            Clear Completed
                        </div>
                    </footer>
                </section>
            </div>
            <footer className="p-1 text-xs font-light">Developed by Santiago Combina</footer>
        </div>
    );
}

export default App;
