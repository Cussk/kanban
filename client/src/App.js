import React from "react";
import {Route, Routes} from "react-router-dom";
import Comments from "./components/Comments";
import Task from "./components/Task";
import Login from "./components/Login";

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/task" element={<Task />} />
        {/* routes to comment page based on item category and id */}
          <Route path="/comments/:category/:id" element={<Comments />} />
        </Routes>
      </div>
  );
}
export default App;
