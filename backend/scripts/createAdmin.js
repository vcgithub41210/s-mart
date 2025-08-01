import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@smart.com',
      password: 'admin123', // Change this to a strong password
      fullName: 'System Administrator',
      role: 'admin'
    });

    const staffUser = new User({
      username: 'staff',
      email: 'staff@smart.com', 
      password: 'staff123', // Change this to a strong password
      fullName: 'Staff Member',
      role: 'staff'
    });

    await adminUser.save();
    await staffUser.save();

    console.log('✅ Admin and Staff users created successfully!');
    console.log('Admin - Username: admin, Password: admin123');
    console.log('Staff - Username: staff, Password: staff123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    process.exit(1);
  }
};

createAdminUser();
