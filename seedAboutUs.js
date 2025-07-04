const mongoose = require('mongoose');
const AboutUs = require('./models/aboutUs'); // Adjust the path as needed

mongoose.connect('mongodb://localhost:27017/Melo_films', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyAboutUs = {
  ourStory: {
    heading: 'Our Journey in Cinema',
    paragraph1: 'Melo Films began with a passion for visual storytelling and a vision to redefine cinematic experiences.',
    paragraph2: 'We’ve grown into a diverse team, producing films that resonate with audiences globally.',
    imageUrl: '/images/ourstory.jpg',
    stats: [
      { label: 'Films Produced', value: '25+' },
      { label: 'International Awards', value: '15' },
      { label: 'Festival Participations', value: '30+' },
    ],
  },
  team: [
    {
      name: 'Michael Reeves',
      role: 'Founder & Creative Director',
      description: 'Award-winning director with 20+ years of storytelling excellence.',
      imageUrl: '/images/team/michael.jpg',
    },
    {
      name: 'Sarah Chen',
      role: 'Executive Producer',
      description: 'Combining business with creativity to lead productions to success.',
      imageUrl: '/images/team/sarah.jpg',
    },
  ],
  clients: [
    { logoUrl: '/images/clients/client1.png' },
    { logoUrl: '/images/clients/client2.png' },
    { logoUrl: '/images/clients/client3.png' },
  ],
  festivals: [
    { name: 'Cannes Film Festival', imageUrl: '/images/festivals/cannes.png' },
    { name: 'Sundance Film Festival', imageUrl: '/images/festivals/sundance.png' },
  ],
  awards: [
    {
      awardTitle: 'Best Director',
      festivalName: 'Cannes Film Festival',
      filmName: 'The Forgotten Echo (2022)',
    },
    {
      awardTitle: 'Best Picture',
      festivalName: 'Sundance Film Festival',
      filmName: 'Beyond the Stars (2021)',
    },
  ],
};

async function seed() {
  try {
    await AboutUs.deleteMany();
    await AboutUs.create(dummyAboutUs);
    console.log('✅ About Us data seeded successfully!');
  } catch (err) {
    console.error('❌ Failed to seed About Us data:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
