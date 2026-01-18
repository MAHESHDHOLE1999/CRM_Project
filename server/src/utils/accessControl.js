// =====================================================
// FILE: backend/utils/accessControl.js (NEW FILE)
// Purpose: Helper function to get all accessible user IDs
// =====================================================

export const getAccessibleUserIds = async (userId, User) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return [userId]; // Return only the user's own ID if user not found
    }

    if (user.role === 'admin') {
      // Admin can see: their own data + data from users they created
      const createdUsers = await User.find({ createdBy: userId }).select('_id');
      const userIds = [userId, ...createdUsers.map(u => u._id)];
      return userIds;
    } else {
      // Regular user can see: their own data + admin's data (creator's data)
      return [userId, user.createdBy];
    }
  } catch (error) {
    console.error('Error in getAccessibleUserIds:', error);
    return [userId]; // Fallback to user's own ID
  }
};