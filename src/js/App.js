import React, { useState } from "react";
import Home from "./Home";
import BlueQuill from "./BlueQuill";
import Login from "./Login";
import { isLoggedIn } from "./services/AuthService";
import Sidebar from "./Sidebar";
import {
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./Dashboard";
import UsersIndex from "./admin/users/Index";
import UsersForm from "./admin/users/Form";

const AdminArea = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn()) {
    return <Login/>;
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className={`app-main-section ${isSidebarOpen ? 'open' : ''}`}>
        <main className="container-fluid p-3">
          <Routes>
            <Route
              index
              element={<Dashboard/>}
            />
            <Route path="users">
              <Route
                index
                element={<UsersIndex/>}
              />
              <Route
                path="new"
                element={<UsersForm/>}
              />
              <Route
                path=":id/edit"
                element={<UsersForm/>}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home/>}
      />
      <Route
        path="/blue-quill"
        element={<BlueQuill/>}
      />
      <Route
        path="/admin/*"
        element={<AdminArea/>}
      />
      <Route
        path="*"
        element={<Home/>}
      />
    </Routes>
  );
};

export default App;
