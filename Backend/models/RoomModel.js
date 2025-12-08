import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    image: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    type: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    // availabilityDates: [
    //   {
    //     startDate: {
    //       type: Date,
    //       required: true,
    //     },
    //     endDate: {
    //       type: Date,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
