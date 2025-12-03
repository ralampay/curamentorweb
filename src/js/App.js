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
import UsersShow from "./admin/users/Show";
import CoursesIndex from "./admin/courses/Index";
import CoursesForm from "./admin/courses/Form";
import CoursesShow from "./admin/courses/Show";
import FacultiesIndex from "./admin/faculties/Index";
import FacultiesForm from "./admin/faculties/Form";
import FacultiesShow from "./admin/faculties/Show";
import StudentsIndex from "./admin/students/Index";
import StudentsForm from "./admin/students/Form";
import StudentsShow from "./admin/students/Show";
import PublicationsIndex from "./admin/publications/Index";
import PublicationsForm from "./admin/publications/Form";
import PublicationsShow from "./admin/publications/Show";

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
              <Route
                path=":id"
                element={<UsersShow/>}
              />
            </Route>
            <Route path="courses">
              <Route
                index
                element={<CoursesIndex/>}
              />
              <Route
                path="new"
                element={<CoursesForm/>}
              />
              <Route
                path=":id/edit"
                element={<CoursesForm/>}
              />
              <Route
                path=":id"
                element={<CoursesShow/>}
              />
            </Route>
            <Route path="faculties">
              <Route
                index
                element={<FacultiesIndex/>}
              />
              <Route
                path="new"
                element={<FacultiesForm/>}
              />
              <Route
                path=":id/edit"
                element={<FacultiesForm/>}
              />
              <Route
                path=":id"
                element={<FacultiesShow/>}
              />
            </Route>
            <Route path="students">
              <Route
                index
                element={<StudentsIndex/>}
              />
              <Route
                path="new"
                element={<StudentsForm/>}
              />
              <Route
                path=":id/edit"
                element={<StudentsForm/>}
              />
              <Route
                path=":id"
                element={<StudentsShow/>}
              />
            </Route>
            <Route path="publications">
              <Route
                index
                element={<PublicationsIndex/>}
              />
              <Route
                path="new"
                element={<PublicationsForm/>}
              />
              <Route
                path=":id/edit"
                element={<PublicationsForm/>}
              />
              <Route
                path=":id"
                element={<PublicationsShow/>}
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
