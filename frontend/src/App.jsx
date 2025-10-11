

//
import React from 'react'

//
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TasksList from './pages/tasks/TasksList';
import UserList from './pages/users/UserList';
import CreateTask from './pages/tasks/CreateTask';
import CreateUser from './pages/users/CreateUser';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>

          {/* dash */}
          <Route path={"/dashboard/admin"} element={ <AdminDashboard /> } />

          {/* tasks */}
          <Route path={"/tasks/list"} element={<TasksList />} />
          <Route path={"/tasks/create"} element={<CreateTask />} />

          {/* users */}
          <Route path={"/users/create"} element={< CreateUser />} />
          <Route path={"/users/list"} element={< UserList />} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;