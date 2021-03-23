var express = require('express');
var router = express.Router();


// 获取所有用户的列表
router.get('/userList',(req,res)=>{
         res.send({
             code:0,
             data:[1,2,3,4,5,6]
         })
    })


module.exports = router;
