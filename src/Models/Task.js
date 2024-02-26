const mongoose = require('mongoose');
const checklistItemSchema = new mongoose.Schema({
  checked: {
    type: Boolean,
    default: false
  },
  checklist_title: {
    type: String,
    required: true
  }
});
const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  checklist: [checklistItemSchema],
  dueDate: {
    type: Date,
    required: false,
    default:null
  },
  state: {
    type: String,
    required: true
  }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;