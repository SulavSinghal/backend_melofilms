const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  ourStory: {
    heading: { type: String },
    paragraph1: { type: String, required: true },
    paragraph2: { type: String },
    imageUrl: { type: String, required: true },
    stats: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
      }
    ]
  },

  team: [
    {
      name: { type: String },
      role: { type: String },
      description: { type: String },
      imageUrl: { type: String }
    }
  ],

  clients: [
    {
      name: { type: String },
      logoUrl: { type: String, required: true }
    }
  ],

  festivals: [
    {
      name: { type: String, required: true },
      imageUrl: { type: String, required: true }
    }
  ],

  awards: [
    {
      awardTitle: { type: String, required: true },
      festivalName: { type: String, required: true },
      filmName: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', aboutUsSchema);
