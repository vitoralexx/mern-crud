
//
import { create } from "zustand";
import axios from "axios";

//
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const useTaskStore = create((set) => ({
  tasks: [],
  task: null,
  stats: null,
  isLoading: false,
  error: null,

  // fetch all tasks
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: response.data.allTasks, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // get task by id
  fetchTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ task: response.data.task, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch task: ",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // update a task
  updateTask: async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${backendUrl}/api/tasks/${id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.task : task
        ),
      }));


    } catch (error) {
      console.error("Failed to update task: ", error.message);
    }
  },

  // get task stats
  fetchTaskStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/tasks/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ stats: response.data, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch task stats:",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // delete taks
  deleteTask: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      await axios.delete(`${backendUrl}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        tasks: state.tasks.filter((user) => user._id !== id),
      }));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete user: ",
        error.response?.data || error.message
      );
    }
  },

  //
  clearTask: () => set({ task: null }),

  // create new task
  createTask: async () => {
    try {


    } catch (error) {

    }
  },

}));

export default useTaskStore;