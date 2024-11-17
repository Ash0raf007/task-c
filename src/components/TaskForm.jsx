import React, { useState } from "react";
import { TextField, Button, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";

function TaskForm({ open, onClose, onSubmit, initialTask = {} }) {
  const [task, setTask] = useState({
    text: initialTask.text || "",
    dueDate: initialTask.dueDate || "",
    priority: initialTask.priority || "Low",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(task);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTask.id ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Title"
          name="text"
          fullWidth
          margin="normal"
          value={task.text}
          onChange={handleChange}
        />
        <TextField
          label="Due Date"
          name="dueDate"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={task.dueDate}
          onChange={handleChange}
        />
        <TextField
          label="Priority"
          name="priority"
          select
          fullWidth
          margin="normal"
          value={task.priority}
          onChange={handleChange}
        >
          {["High", "Medium", "Low"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskForm;
