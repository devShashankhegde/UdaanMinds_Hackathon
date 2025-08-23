import mongoose from 'mongoose';
import MarketPrice from '../models/MarketPrice';
import User from '../models/User';
import Question from '../models/Question';
import Listing from '../models/Listing';

export async function seedDatabase() {
  try {
    // Clear existing data
    await MarketPrice.deleteMany({});
    await Question.deleteMany({});
    await Listing.deleteMany({});
    
    // Sample market prices
    const samplePrices = [
      {
        crop: 'rice',
        variety: 'Basmati',
        market: 'Delhi Mandi',
        state: 'Delhi',
        district: 'New Delhi',
        price: { min: 4500, max: 5200, modal: 4850, unit: 'per quintal' },
        date: new Date(),
        source: 'manual'
      },
      {
        crop: 'wheat',
        variety: 'HD-2967',
        market: 'Pune APMC',
        state: 'Maharashtra',
        district: 'Pune',
        price: { min: 2100, max: 2350, modal: 2225, unit: 'per quintal' },
        date: new Date(),
        source: 'manual'
      },
      {
        crop: 'sugarcane',
        market: 'Kolhapur Market',
        state: 'Maharashtra',
        district: 'Kolhapur',
        price: { min: 280, max: 320, modal: 300, unit: 'per quintal' },
        date: new Date(),
        source: 'manual'
      },
      {
        crop: 'cotton',
        variety: 'Bt Cotton',
        market: 'Nagpur Cotton Market',
        state: 'Maharashtra',
        district: 'Nagpur',
        price: { min: 5800, max: 6200, modal: 6000, unit: 'per quintal' },
        date: new Date(),
        source: 'manual'
      },
      {
        crop: 'tomato',
        market: 'Bangalore Market',
        state: 'Karnataka',
        district: 'Bangalore',
        price: { min: 15, max: 25, modal: 20, unit: 'per kg' },
        date: new Date(),
        source: 'manual'
      },
      {
        crop: 'onion',
        market: 'Nashik APMC',
        state: 'Maharashtra',
        district: 'Nashik',
        price: { min: 12, max: 18, modal: 15, unit: 'per kg' },
        date: new Date(),
        source: 'manual'
      }
    ];

    await MarketPrice.insertMany(samplePrices);
    console.log('Sample market prices added');

    // Create a sample user for demo purposes
    const sampleUser = new User({
      username: 'demo_farmer',
      email: 'demo@krishilink.com',
      password: 'demo123',
      role: 'farmer',
      profile: {
        fullName: 'Demo Farmer',
        phone: '9876543210',
        location: 'Pune, Maharashtra',
        farmSize: '10 acres',
        cropTypes: ['rice', 'wheat', 'sugarcane']
      }
    });

    await sampleUser.save();
    console.log('Sample user created');

    // Sample questions
    const sampleQuestions = [
      {
        title: 'Best time to plant rice in Maharashtra?',
        content: 'I am planning to plant rice this season. What is the best time to plant rice in Maharashtra? Also, which variety would be most suitable for the current weather conditions?',
        author: sampleUser._id,
        category: 'crops',
        tags: ['rice', 'planting', 'maharashtra', 'timing'],
        answers: [],
        votes: 5,
        views: 23
      },
      {
        title: 'Organic pest control methods for tomatoes',
        content: 'My tomato plants are being affected by pests. I want to use organic methods only. What are some effective organic pest control methods that I can use?',
        author: sampleUser._id,
        category: 'pest_control',
        tags: ['organic', 'tomato', 'pest-control', 'natural'],
        answers: [],
        votes: 8,
        views: 45
      },
      {
        title: 'Soil testing recommendations',
        content: 'I want to get my soil tested before the next planting season. Where can I get reliable soil testing done and what parameters should I check?',
        author: sampleUser._id,
        category: 'soil',
        tags: ['soil-testing', 'analysis', 'nutrients'],
        answers: [],
        votes: 3,
        views: 12
      }
    ];

    await Question.insertMany(sampleQuestions);
    console.log('Sample questions added');

    // Sample listings
    const sampleListings = [
      {
        title: 'Tractor Available for Rent',
        description: 'Mahindra 575 DI tractor available for rent. Well maintained, suitable for all farming operations including plowing, sowing, and harvesting.',
        category: 'tool',
        subcategory: 'Tractor',
        price: { amount: 800, unit: 'per day', negotiable: true },
        location: { state: 'Maharashtra', district: 'Pune', pincode: '411001' },
        contact: { phone: '9876543210', email: 'demo@krishilink.com' },
        images: [],
        seller: sampleUser._id,
        status: 'active',
        specifications: new Map([
          ['Brand', 'Mahindra'],
          ['Model', '575 DI'],
          ['HP', '47'],
          ['Year', '2020']
        ]),
        availability: { from: new Date(), to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      },
      {
        title: 'Fresh Organic Rice for Sale',
        description: 'Premium quality organic basmati rice harvested this season. Grown without chemical fertilizers or pesticides. Available in bulk quantities.',
        category: 'crop',
        subcategory: 'Rice',
        price: { amount: 4500, unit: 'per quintal', negotiable: true },
        location: { state: 'Punjab', district: 'Amritsar' },
        contact: { phone: '9876543211' },
        images: [],
        seller: sampleUser._id,
        status: 'active',
        specifications: new Map([
          ['Variety', 'Basmati'],
          ['Type', 'Organic'],
          ['Moisture', '12%'],
          ['Purity', '99%']
        ]),
        availability: { from: new Date() }
      },
      {
        title: 'Cold Storage Facility Available',
        description: 'Modern cold storage facility with temperature control. Suitable for vegetables, fruits, and other perishable agricultural products.',
        category: 'storage',
        subcategory: 'Cold Storage',
        price: { amount: 50, unit: 'per quintal per month', negotiable: false },
        location: { state: 'Maharashtra', district: 'Nashik' },
        contact: { phone: '9876543212', email: 'storage@krishilink.com' },
        images: [],
        seller: sampleUser._id,
        status: 'active',
        specifications: new Map([
          ['Capacity', '1000 MT'],
          ['Temperature Range', '0°C to 4°C'],
          ['Humidity Control', 'Yes']
        ]),
        availability: { from: new Date() }
      }
    ];

    await Listing.insertMany(sampleListings);
    console.log('Sample listings added');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
