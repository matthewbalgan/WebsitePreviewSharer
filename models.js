import mongoose, { model } from 'mongoose'
let models = {}

main()
async function main(){
  console.log('connecting to mongodb')
  await mongoose.connect('mongodb+srv://balganm:happyhusky@cluster0.rnczvui.mongodb.net/websharer?retryWrites=true&w=majority')
  console.log('successfully connected to mongodb')


  const userSchema = new mongoose.Schema({
      url: String,
      description: String,
      username: String,
      likes: [String],
      created_date: Date,
      usage: String
  })

  models.User = mongoose.model('Post', userSchema)

  const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    created_date: Date
  })

  models.Comment = mongoose.model('Comment', commentSchema)



  const userInfoSchema = new mongoose.Schema({
    username: String,
    note: String
  })

  models.UserInfo = mongoose.model('UserInfo', userInfoSchema)



  console.log('mongoose models created')

}


export default models