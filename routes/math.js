const express = require('express');

const router = express.Router();


router.post('/sum', async (req, res) => {
    try {
      const { a, b } = req.body;
      if (!a) {
        return res.status(400).json({ 
          error: 'a is required',
        });
      }
      if (!b) {
        return res.status(400).json({ 
          error: 'b is required',
        });
      }
      res.json({
        success: true,
        result: a + b,
      });
      
    } catch (error) {
      console.error('❌ Math error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Math failed. Please try again.',
      });
    }
  });

  module.exports = router;