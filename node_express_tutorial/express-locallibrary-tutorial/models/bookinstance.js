const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const {convert_date_to_str_yyyy_mm_dd} = require("./common_functions.js");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  // return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
  if(this.due_back){
    let dueDateStr = convert_date_to_str_yyyy_mm_dd(this.due_back);
    return dueDateStr;
  }
  return null;
});

// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
