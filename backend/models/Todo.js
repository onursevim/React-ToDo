const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:false
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; 