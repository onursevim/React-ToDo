const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    // JWT token
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Başarılı giriş response'u
    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        userName: user.userName
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;