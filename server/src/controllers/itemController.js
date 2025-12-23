// import Item from '../models/Item.js';

// export const createItem = async (req, res) => {
//   try {
//     const itemData = req.body;
    
//     const item = await Item.create(itemData);

//     res.status(201).json({
//       success: true,
//       message: 'Item created successfully',
//       data: item
//     });
//   } catch (error) {
//     console.error('Create item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating item'
//     });
//   }
// };

// export const getItems = async (req, res) => {
//   try {
//     const { 
//       status, 
//       search, 
//       category,
//       page = 1,
//       limit = 50
//     } = req.query;
    
//     const query = {};
    
//     if (status && status !== 'all') {
//       query.status = status;
//     }
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { nameMarathi: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (category && category !== 'all') {
//       query.category = category;
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [items, total] = await Promise.all([
//       Item.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .lean(),
//       Item.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: {
//         items,
//         pagination: {
//           total,
//           page: Number(page),
//           limit: Number(limit),
//           totalPages: Math.ceil(total / Number(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get items error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching items'
//     });
//   }
// };

// export const getItemById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: item
//     });
//   } catch (error) {
//     console.error('Get item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching item'
//     });
//   }
// };

// export const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const item = await Item.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Item updated successfully',
//       data: item
//     });
//   } catch (error) {
//     console.error('Update item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating item'
//     });
//   }
// };

// export const deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const item = await Item.findByIdAndDelete(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Item deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting item'
//     });
//   }
// };

// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Item.distinct('category');
    
//     res.json({
//       success: true,
//       data: categories.filter(cat => cat) // Filter out null/undefined
//     });
//   } catch (error) {
//     console.error('Get categories error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching categories'
//     });
//   }
// };

import Item from '../models/Item.js';

export const createItem = async (req, res) => {
  try {
    const itemData = req.body;
    
    // Set availableQuantity equal to totalQuantity initially
    if (itemData.totalQuantity) {
      itemData.availableQuantity = itemData.totalQuantity;
      itemData.rentedQuantity = 0;
    }
    
    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating item'
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      category,
      inStock,
      page = 1,
      limit = 50
    } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameMarathi: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by stock availability
    if (inStock === 'true') {
      query.availableQuantity = { $gt: 0 };
    } else if (inStock === 'false') {
      query.availableQuantity = 0;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Item.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Item.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items'
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item'
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If totalQuantity is updated, adjust availableQuantity
    if (updateData.totalQuantity !== undefined) {
      const item = await Item.findById(id);
      if (item) {
        const difference = updateData.totalQuantity - item.totalQuantity;
        updateData.availableQuantity = Math.max(0, item.availableQuantity + difference);
      }
    }

    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item'
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is currently rented
    if (item.rentedQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item that is currently rented'
      });
    }

    await Item.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct('category');
    
    res.json({
      success: true,
      data: categories.filter(cat => cat)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

export const rentItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.rentItem(quantity);

    res.json({
      success: true,
      message: 'Item rented successfully',
      data: item
    });
  } catch (error) {
    console.error('Rent item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error renting item'
    });
  }
};

export const returnItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.returnItem(quantity);

    res.json({
      success: true,
      message: 'Item returned successfully',
      data: item
    });
  } catch (error) {
    console.error('Return item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error returning item'
    });
  }
};

export const getInventoryStats = async (req, res) => {
  try {
    const stats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$totalQuantity' },
          availableQuantity: { $sum: '$availableQuantity' },
          rentedQuantity: { $sum: '$rentedQuantity' },
          totalValue: { $sum: { $multiply: ['$totalQuantity', '$price'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalItems: 0,
        totalQuantity: 0,
        availableQuantity: 0,
        rentedQuantity: 0,
        totalValue: 0
      }
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics'
    });
  }
};