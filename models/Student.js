import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const studentSchema = new Schema ({
  
  userId :{type:Schema.Types.ObjectId , ref:"User", required:true},
  studentId :{type: String, required: true , unique:true},
  dob:{type: Date},
  gender:{type: String},
  degree:{type:String},
  department :{type:Schema.Types.ObjectId , ref:"Department", required:true},
  createdAt :{type:Date,default: Date.now},
  updatedAt:{type:Date, default: Date.now},

})

const Student =mongoose.model("Student" , studentSchema);
export default Student;
