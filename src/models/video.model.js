import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
      videoFile: {
        type: String, // Cloudinary URL for the video file
        required: true
      },
      thumbnail :{
        type: String, // Cloudinary URL for the thumbnail image
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,   // Duration from the cloudinary video
        required: true
      },
      views: {
        type: Number,
        default: 0
      },
      isPublished: {
        type: Boolean,
        default: true
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    },
    {timestamps: true}
)



videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);

