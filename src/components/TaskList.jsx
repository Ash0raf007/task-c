import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { List, ListItem, ListItemText, IconButton, Checkbox, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskForm from "./TaskForm";

function TaskList() {
  const { tasks, addTask, editTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
        Add Task
      </Button>
      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(task) => {
          editingTask ? editTask({ ...editingTask, ...task }) : addTask(task);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} divider>
            <Checkbox checked={task.completed} />
            <ListItemText
              primary={task.text}
              secondary={`Due: ${task.dueDate} | Priority: ${task.priority}`}
            />
            <IconButton onClick={() => handleEdit(task)}>
              <span>Edit</span>
            </IconButton>
            <IconButton edge="end" onClick={() => deleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default TaskList;
