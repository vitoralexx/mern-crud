import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  users: [],
  userStats: null,
  isLoading: false,
  error: null,

  // fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: response.data.allUsers, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // fetch user
  fetchUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ currentUser: data.user ?? data, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // update a user
  updateUser: async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/api/users/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? response.data.user : user
        ),
      }));
    } catch (error) {
      console.error("Failed to update user: ", error.message);
    }
  },

  // get users stats
  fetchUserStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/users/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ userStats: response.data, isLoading: false });
    } catch (error) {
      console.error(
        "Failed to fetch user stats: ",
        error.response?.data || error.message
      );
      set({ error: error.message, isLoading: false });
    }
  },

  // delete user
  deleteUser: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      await axios.delete(`${backendUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
      }));

      console.log("User deleted successfully");
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error.response?.data || error.message
      );
    }
  },

  // create user
  createUser: async () => {
    e.preventDefault();
    try {
      



    } catch (error) {

    }
  }




}));

export default useUserStore;