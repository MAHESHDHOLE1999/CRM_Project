// File: scripts/migrateTenantData.js
// Run this ONCE to migrate existing users to multi-tenant structure

import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateTenantData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all admin users
    const admins = await User.find({ role: 'admin' });
    console.log(`\n📊 Found ${admins.length} admin(s)`);

    if (admins.length === 0) {
      console.log('❌ No admins found. Please create at least one admin account first.');
      process.exit(1);
    }

    // List all admins
    console.log('\n👥 Admin Users:');
    admins.forEach((admin, idx) => {
      console.log(`${idx + 1}. ${admin.username} (${admin.email}) - ID: ${admin._id}`);
    });

    // Get all non-admin users
    const regularUsers = await User.find({ role: 'user', createdBy: null });
    console.log(`\n📋 Found ${regularUsers.length} unassigned user(s)`);

    if (regularUsers.length === 0) {
      console.log('✅ All users are already assigned to admins. No migration needed.');
      process.exit(0);
    }

    // Migration Strategy:
    // Option 1: Assign all users to the first (primary) admin
    const primaryAdmin = admins[0];
    console.log(`\n🔗 Assigning all users to primary admin: ${primaryAdmin.username}`);

    const updateResult = await User.updateMany(
      { role: 'user', createdBy: null },
      {
        $set: {
          createdBy: primaryAdmin._id,
          managedBy: primaryAdmin._id
        }
      }
    );

    console.log(`\n✅ Migration Complete!`);
    console.log(`   - Updated: ${updateResult.modifiedCount} user(s)`);
    console.log(`   - Primary Admin: ${primaryAdmin.username}`);

    // Verify migration
    const migratedUsers = await User.find({ createdBy: primaryAdmin._id });
    console.log(`\n📊 Verification: ${migratedUsers.length} users now belong to ${primaryAdmin.username}`);

    // Show sample
    if (migratedUsers.length > 0) {
      console.log('\n📝 Sample Users:');
      migratedUsers.slice(0, 3).forEach(user => {
        console.log(`   - ${user.username} (${user.email})`);
      });
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

// Alternative: Manual Assignment Based on Email Pattern
export const migrateWithEmailPattern = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Example: If user email contains 'team1', assign to admin1
    const assignments = {
      'team1': 'admin1_email@example.com',
      'team2': 'admin2_email@example.com',
    };

    for (const [pattern, adminEmail] of Object.entries(assignments)) {
      const admin = await User.findOne({ email: adminEmail, role: 'admin' });
      if (!admin) {
        console.log(`⚠️ Admin not found: ${adminEmail}`);
        continue;
      }

      const usersToUpdate = await User.find({
        role: 'user',
        createdBy: null,
        email: { $regex: pattern, $options: 'i' }
      });

      if (usersToUpdate.length > 0) {
        await User.updateMany(
          { _id: { $in: usersToUpdate.map(u => u._id) } },
          {
            $set: {
              createdBy: admin._id,
              managedBy: admin._id
            }
          }
        );

        console.log(`✅ Assigned ${usersToUpdate.length} users to ${admin.username}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the migration
migrateTenantData();