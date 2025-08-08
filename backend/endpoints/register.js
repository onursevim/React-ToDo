const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async(req,res)=>{

  try{
    
    const{userName,password} = req.body

    const existingUser = await User.findOne({userName});
    if(existingUser){
      return res.status(400).json({message:'Bu kullanıcı adı zaten kullanılıyor'})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const newUser = new User({
      userName,
      password: hashedPassword
    });

    await newUser.save();

    // JWT token
    const token = jwt.sign(
      { userId: newUser._id, userName: newUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: newUser._id,
        userName: newUser.userName
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;