const express = require('express');
const jwt = require('jsonwebtoken');
const { Todo } = require('../models');

const router = express.Router();

// GET /api/todos - Kullanıcının todo'larını listele
router.get('/todos', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli' });
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const todos = await Todo.find({ userId: user.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Todo list error:', error);
    res.status(500).json({ message: 'Token geçersiz veya hata oluştu' });
  }
});

// POST /api/todos - Yeni todo ekle
router.post('/todos', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli' });
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { title, category } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Todo başlığı gerekli' });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({ message: 'Kategori gerekli' });
    }

    const newTodo = new Todo({
      title: title.trim(),
      category: category.trim(),
      userId: user.userId
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Todo create error:', error);
    res.status(500).json({ message: 'Token geçersiz veya hata oluştu' });
  }
});

// PUT /api/todos/:id - Todo'yu güncelle (tamamlandı/tamamlanmadı)
router.put('/todos/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli' });
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;
    const { completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { completed },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo bulunamadı' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Todo update error:', error);
    res.status(500).json({ message: 'Token geçersiz veya hata oluştu' });
  }
});

// DELETE /api/todos/:id - Todo'yu sil
router.delete('/todos/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli' });
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, userId: user.userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo bulunamadı' });
    }

    res.json({ message: 'Todo başarıyla silindi' });
  } catch (error) {
    console.error('Todo delete error:', error);
    res.status(500).json({ message: 'Token geçersiz veya hata oluştu' });
  }
});

module.exports = router;
