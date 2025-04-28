import React, { useEffect, useState } from 'react';
import './Reminders.css';

const Reminders = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    date: '',
    time: '',
    priority: 'Medium',
  });
  useEffect(() => {
      const savedMood = localStorage.getItem('chat_mood');
      console.log(savedMood)
      if (savedMood) {
        document.body.className = '';
        document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
      }
    }, []);
  // Load tasks from localStorage on initial render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(saved);
  }, []);

  // Check tasks and notify when the reminder time arrives
  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();

      setTasks(prevTasks => {
        return prevTasks.map(task => {
          const taskTime = new Date(`${task.date}T${task.time}`);

          let reminderOffset = 0;
          if (task.priority === 'Low') {
            reminderOffset = 30 * 60 * 1000; // 30 minutes
          } else if (task.priority === 'Medium') {
            reminderOffset = 45 * 60 * 1000; // 45 minutes
          } else if (task.priority === 'High') {
            reminderOffset = 60 * 60 * 1000; // 1 hour
          }

          const reminderTime = new Date(taskTime.getTime() - reminderOffset);

          if (!task.notified && now >= reminderTime && now <= taskTime) {
            notifyUser(task);
            return { ...task, notified: true }; // Mark as notified
          }

          return task;
        });
      });
    };

    const interval = setInterval(checkTasks, 60000); // Check every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add a new task
  const handleAddTask = () => {
    setTasks(prev => [...prev, { ...newTask, notified: false }]);
    setNewTask({ name: '', date: '', time: '', priority: 'Medium' });
    setShowForm(false);
  };

  // Notify the user about the task reminder
  const notifyUser = (task) => {
    if (Notification.permission === 'granted') {
      new Notification(`Task Reminder: ${task.name}`, {
        body: `Reminder for task "${task.name}"!`,
        icon: '/path-to-your-icon.png',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(`Task Reminder: ${task.name}`, {
            body: `Reminder for task "${task.name}"!`,
            icon: '/path-to-your-icon.png',
          });
        }
      });
    }
  };

  // Remove a task from the list
  const removeTask = (taskToRemove) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter(task => task !== taskToRemove);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save updated list
      return updatedTasks;
    });
  };

  return (
    <div className="reminders-container">
      <h2 className="reminders-title">⏰ Your Reminders</h2>

      {tasks.length === 0 ? (
        <p>No reminders set yet.</p>
      ) : (
        <ul className="reminder-list">
          {tasks.map((task, idx) => (
            <li key={idx} className={`reminder-item ${task.priority.toLowerCase()}`}>
              <strong>{task.name}</strong> — {task.date} at {task.time}{' '}
              <span className="reminder-priority">[{task.priority}]</span>
              <button onClick={() => removeTask(task)} className="complete-task-button">
                Mark Completed
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowForm(!showForm)} className="add-reminder-button">
        {showForm ? 'Cancel' : '➕ Add Reminder'}
      </button>

      {showForm && (
        <div className="reminder-form">
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name}
            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type="date"
            value={newTask.date}
            onChange={e => setNewTask({ ...newTask, date: e.target.value })}
          />
          <input
            type="time"
            value={newTask.time}
            onChange={e => setNewTask({ ...newTask, time: e.target.value })}
          />
          <select
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button onClick={handleAddTask}>Save Reminder</button>
        </div>
      )}
    </div>
  );
};

export default Reminders;
