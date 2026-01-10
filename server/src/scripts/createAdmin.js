import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import logger from '../../utils/logger.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ajay.com' });
    
    if (existingAdmin) {
      logger.info('❌ Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@ajay.com',
      password: hashedPassword,
      role: 'admin'
    });

    logger.info('✅ Admin user created successfully!');
    logger.info('📧 Email: admin@ajay.com');
    logger.info('🔑 Password: admin123');
    logger.info('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();