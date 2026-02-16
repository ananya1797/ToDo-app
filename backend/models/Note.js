const mongoose= require('mongoose')
const {Schema}=mongoose;

const NoteSchema=new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title:{ type: String },
    description: {type: String},
    createdAt: { type: Date, default: Date.now }

});
module.exports = mongoose.model('Note', NoteSchema);