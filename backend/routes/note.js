const express=require('express')
const router=express.Router()
const auth=require('../middleware/fetchuser')
const Note=require('../models/Note')
const User=require('../models/User')


//create a note
////http:localhost:5000/api/note/createnote
router.post('/createnote',auth,async(req,res)=>{
    try{
        const title=req.body.title;
    const desc=req.body.description;
    const user = await User.findById(req.user.id);
    const noteCount=await Note.countDocuments({userId:req.user.id})
    if(!user.isPremium && noteCount>3){
        return res.status(403).json({
        msg: "Free limit reached. Upgrade to premium to add more notes."
      });
    }
    const note=await Note.create({
        userId: req.user.id,
        title:title,
        description:desc
    });
    res.json(note);
    
}
catch(err){
    res.status(500).send('Note not created, please try again')
}


});

//fetch all notes of a user
//http:localhost:5000/api/note
router.get('/',auth,async(req,res)=>{
    try{
        const notes=await Note.find({userId:req.user.id});
        res.json(notes);
    }
    catch (err) {
    res.status(500).send("Server error");
  }
});

//delete a note
//http:localhost:5000/api/note/deletenote/:id
router.delete('/:id',auth,async(req,res)=>{
    try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports=router;