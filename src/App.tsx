import {Route, Routes} from "react-router-dom";

import {Layout} from "./components/layout/layout";
import {ProtectedRoute} from "./components/protected-route";
import {Login} from "./pages/login";
import {Todo} from "./pages/todo";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<Login />} path="/login" />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Todo />} path="/" />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
