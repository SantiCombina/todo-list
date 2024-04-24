import {TasksSkeleton} from "./skeleton/tasks-skeleton";
import {TodoMessage} from "./todo-message";

interface Props {
    loading: boolean;
}

export function TodoLoading({loading}: Props) {
    return loading ? <TasksSkeleton /> : <TodoMessage />;
}
