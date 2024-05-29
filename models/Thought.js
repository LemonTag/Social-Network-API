const dateFormat = require('../utils/dateFormat')
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');


const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timeStamp => dateFormat(timeStamp)
    },
    userName: {
      type: String,
      required: true,

    },
    reactions: [reactionSchema],

    // reactions: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Reaction'
    // }
    // ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);


thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length
})
const Thought = model('Thought', thoughtSchema)

module.exports = Thought;
