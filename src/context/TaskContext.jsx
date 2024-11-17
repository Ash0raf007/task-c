import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const TaskContext = createContext();
const socket = io("http://localhost:3000", { autoConnect: false });

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Dummy JSON API
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/todos");
      setTasks(response.data.todos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a task
  const addTask = async (task) => {
    const tempTask = { ...task, id: Date.now() }; // Temporary ID
    setTasks([...tasks, tempTask]);
    try {
      const response = await axios.post("https://dummyjson.com/todos/add", task);
      setTasks([...tasks.filter((t) => t.id !== tempTask.id), response.data]);
      socket.emit("taskAdded", response.data);
    } catch (error) {
      console.error("Error adding task:", error);
      setTasks(tasks); // Revert changes
    }
  };

  // Edit a task
  const editTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `https://dummyjson.com/todos/${updatedTask.id}`,
        updatedTask
      );
      setTasks(tasks.map((task) => (task.id === response.data.id ? response.data : task)));
      socket.emit("taskEdited", response.data);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks); // Optimistic update
    try {
      await axios.delete(`https://dummyjson.com/todos/${id}`);
      socket.emit("taskDeleted", id);
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks(tasks); // Revert changes
    }
  };

  useEffect(() => {
    socket.connect();
    fetchTasks();

    socket.on("updateTasks", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, editTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
