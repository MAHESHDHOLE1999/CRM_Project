import Item from "../models/Item.js";
import logger from "../../utils/logger.js";
import { getAccessibleUserIds } from "../utils/accessControl.js";
import User from "../models/User.js";

// Helper function to determine correct status based on quantities
const determineStatus = (totalQuantity, availableQuantity, rentedQuantity) => {
  if (totalQuantity === 0) {
    return "NotAvailable";
  }

  if (availableQuantity === 0) {
    return "NotAvailable"; // All items are rented
  }

  if (rentedQuantity > 0) {
    return "InUse"; // Some items are rented, some are available
  }

  return "Available"; // All items are available for rent
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const itemData = req.body;

    // Set availableQuantity equal to totalQuantity initially
    if (itemData.totalQuantity) {
      itemData.availableQuantity = itemData.totalQuantity;
      itemData.rentedQuantity = 0;
      itemData.status = "Available";
      itemData.quantityHistory = [
        {
          date: new Date(),
          action: "created",
          quantityAdded: itemData.totalQuantity,
          totalQuantity: itemData.totalQuantity,
          notes: "Item created",
        },
      ];
    }

    itemData.userId = req.userId;
    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    logger.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating item",
      error: error.message,
    });
  }
};

// Get items with filters
export const getItems = async (req, res) => {
  try {
    const {
      status,
      search,
      category,
      inStock,
      page = 1,
      limit = 50,
    } = req.query;

    // const query = { userId: req.userId };
    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);

    const query = { userId: { $in: accessibleUserIds } };

    // Note: Status filter is applied, but frontend recalculates actual status
    if (status && status !== "all") {
      // We still filter by stored status, but frontend will show correct status
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameMarathi: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (inStock === "true") {
      query.availableQuantity = { $gt: 0 };
    } else if (inStock === "false") {
      query.availableQuantity = 0;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Sync status based on actual quantities
    items = items.map((item) => ({
      ...item,
      status: determineStatus(
        item.totalQuantity,
        item.availableQuantity,
        item.rentedQuantity
      ),
    }));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching items",
      error: error.message,
    });
  }
};

// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // let item = await Item.findById(id);
    // let item = await Item.findOne({
    //   _id: id,
    //   userId: req.userId,
    // });
    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);

    let item = await Item.findOne({
      _id: id,
      userId: { $in: accessibleUserIds },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Sync status before returning
    item.status = determineStatus(
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity
    );
    item = await item.save();

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    logger.error("Get item error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching item",
      error: error.message,
    });
  }
};

// Update item with proper quantity management
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // let item = await Item.findById(id);
    let item = await Item.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Handle quantity addition (not replacement)
    if (
      updateData.quantityToAdd !== undefined &&
      updateData.quantityToAdd > 0
    ) {
      const quantityToAdd = Number(updateData.quantityToAdd);
      const previousTotal = item.totalQuantity;
      const newTotal = previousTotal + quantityToAdd;

      // Update quantities
      item.totalQuantity = newTotal;
      item.availableQuantity += quantityToAdd;

      // Initialize quantityHistory if it doesn't exist
      if (!item.quantityHistory) {
        item.quantityHistory = [];
      }

      // Add to history
      item.quantityHistory.push({
        date: new Date(),
        action: "added",
        quantityAdded: quantityToAdd,
        previousTotal: previousTotal,
        totalQuantity: newTotal,
        notes: `Added ${quantityToAdd} unit(s) to existing stock`,
      });

      // Remove quantityToAdd from update data so it doesn't get saved as a field
      delete updateData.quantityToAdd;
    }

    // Update other fields
    if (updateData.name) item.name = updateData.name;
    if (updateData.nameMarathi !== undefined)
      item.nameMarathi = updateData.nameMarathi;
    if (updateData.description !== undefined)
      item.description = updateData.description;
    if (updateData.category !== undefined) item.category = updateData.category;
    if (updateData.price !== undefined) item.price = updateData.price;

    // Auto-sync status based on quantities (not manual status update)
    item.status = determineStatus(
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity
    );

    const updatedItem = await item.save();

    res.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    logger.error("Update item error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // const item = await Item.findById(id);
    const item = await Item.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check if item is currently rented
    if (item.rentedQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete item that is currently rented",
      });
    }

    await Item.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    logger.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct("category");

    res.json({
      success: true,
      data: categories.filter((cat) => cat),
    });
  } catch (error) {
    logger.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// Rent item
export const rentItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    let item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.availableQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${item.availableQuantity}`,
      });
    }

    item.availableQuantity -= quantity;
    item.rentedQuantity += quantity;

    // Auto-sync status
    item.status = determineStatus(
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity
    );

    if (!item.quantityHistory) {
      item.quantityHistory = [];
    }

    item.quantityHistory.push({
      date: new Date(),
      action: "rented",
      quantityChanged: quantity,
      availableQuantity: item.availableQuantity,
      rentedQuantity: item.rentedQuantity,
      notes: `Rented ${quantity} unit(s)`,
    });

    await item.save();

    res.json({
      success: true,
      message: "Item rented successfully",
      data: item,
    });
  } catch (error) {
    logger.error("Rent item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error renting item",
    });
  }
};

// Return item
export const returnItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    let item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.rentedQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Cannot return more than rented. Rented: ${item.rentedQuantity}`,
      });
    }

    item.availableQuantity += quantity;
    item.rentedQuantity -= quantity;

    // Auto-sync status
    item.status = determineStatus(
      item.totalQuantity,
      item.availableQuantity,
      item.rentedQuantity
    );

    if (!item.quantityHistory) {
      item.quantityHistory = [];
    }

    item.quantityHistory.push({
      date: new Date(),
      action: "returned",
      quantityChanged: quantity,
      availableQuantity: item.availableQuantity,
      rentedQuantity: item.rentedQuantity,
      notes: `Returned ${quantity} unit(s)`,
    });

    await item.save();

    res.json({
      success: true,
      message: "Item returned successfully",
      data: item,
    });
  } catch (error) {
    logger.error("Return item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error returning item",
    });
  }
};

// Get inventory stats
export const getInventoryStats = async (req, res) => {
  try {
    // const stats = await Item.aggregate([
    //   { $match: { userId: req.userId} },
    //   {
    //     $group: {
    //       _id: null,
    //       totalItems: { $sum: 1 },
    //       totalQuantity: { $sum: "$totalQuantity" },
    //       availableQuantity: { $sum: "$availableQuantity" },
    //       rentedQuantity: { $sum: "$rentedQuantity" },
    //       totalValue: { $sum: { $multiply: ["$totalQuantity", "$price"] } },
    //     },
    //   },
    // ]);

    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);

    const stats = await Item.aggregate([
      { $match: { userId: { $in: accessibleUserIds } } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$totalQuantity' },
          availableQuantity: { $sum: '$availableQuantity' },
          rentedQuantity: { $sum: '$rentedQuantity' },
          totalValue: { $sum: { $multiply: ['$totalQuantity', '$price'] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalItems: 0,
        totalQuantity: 0,
        availableQuantity: 0,
        rentedQuantity: 0,
        totalValue: 0,
      },
    });
  } catch (error) {
    logger.error("Get inventory stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory statistics",
    });
  }
};

// Bulk rent items
export const bulkRentItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const item of items) {
      try {
        // const itemDoc = await Item.findById(item.itemId);
        const itemDoc = await Item.findOne({
          _id: item.itemId,
          userId: req.userId
        });

        if (!itemDoc) {
          errors.push({
            itemId: item.itemId,
            error: "Item not found",
          });
          continue;
        }

        if (itemDoc.availableQuantity < item.quantity) {
          errors.push({
            itemId: item.itemId,
            itemName: itemDoc.name,
            error: `Insufficient quantity. Available: ${itemDoc.availableQuantity}`,
          });
          continue;
        }

        itemDoc.availableQuantity -= item.quantity;
        itemDoc.rentedQuantity += item.quantity;

        // Auto-sync status
        itemDoc.status = determineStatus(
          itemDoc.totalQuantity,
          itemDoc.availableQuantity,
          itemDoc.rentedQuantity
        );

        await itemDoc.save();

        results.push({
          itemId: item.itemId,
          itemName: itemDoc.name,
          quantityRented: item.quantity,
          availableNow: itemDoc.availableQuantity,
          rentedNow: itemDoc.rentedQuantity,
        });
      } catch (err) {
        errors.push({
          itemId: item.itemId,
          error: err.message,
        });
      }
    }

    res.json({
      success: errors.length === 0,
      message: `${results.length} items rented${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
      data: {
        rented: results,
        failed: errors,
      },
    });
  } catch (error) {
    logger.error("Bulk rent items error:", error);
    res.status(500).json({
      success: false,
      message: "Error renting items",
    });
  }
};

// Bulk return items
export const bulkReturnItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const item of items) {
      try {
        const itemDoc = await Item.findById(item.itemId);

        if (!itemDoc) {
          errors.push({
            itemId: item.itemId,
            error: "Item not found",
          });
          continue;
        }

        if (itemDoc.rentedQuantity < item.quantity) {
          errors.push({
            itemId: item.itemId,
            itemName: itemDoc.name,
            error: `Cannot return more than rented. Rented: ${itemDoc.rentedQuantity}`,
          });
          continue;
        }

        itemDoc.availableQuantity += item.quantity;
        itemDoc.rentedQuantity -= item.quantity;

        // Auto-sync status
        itemDoc.status = determineStatus(
          itemDoc.totalQuantity,
          itemDoc.availableQuantity,
          itemDoc.rentedQuantity
        );

        await itemDoc.save();

        results.push({
          itemId: item.itemId,
          itemName: itemDoc.name,
          quantityReturned: item.quantity,
          availableNow: itemDoc.availableQuantity,
          rentedNow: itemDoc.rentedQuantity,
        });
      } catch (err) {
        errors.push({
          itemId: item.itemId,
          error: err.message,
        });
      }
    }

    res.json({
      success: errors.length === 0,
      message: `${results.length} items returned${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
      data: {
        returned: results,
        failed: errors,
      },
    });
  } catch (error) {
    logger.error("Bulk return items error:", error);
    res.status(500).json({
      success: false,
      message: "Error returning items",
    });
  }
};

// Check availability
export const checkAvailability = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    const availability = [];
    let allAvailable = true;

    for (const item of items) {
      try {
        const itemDoc = await Item.findById(item.itemId);

        if (!itemDoc) {
          availability.push({
            itemId: item.itemId,
            available: false,
            reason: "Item not found",
          });
          allAvailable = false;
          continue;
        }

        const isAvailable = itemDoc.availableQuantity >= item.quantity;
        availability.push({
          itemId: item.itemId,
          itemName: itemDoc.name,
          requestedQuantity: item.quantity,
          availableQuantity: itemDoc.availableQuantity,
          available: isAvailable,
          reason: isAvailable ? "OK" : `Insufficient quantity`,
        });

        if (!isAvailable) allAvailable = false;
      } catch (err) {
        availability.push({
          itemId: item.itemId,
          available: false,
          reason: err.message,
        });
        allAvailable = false;
      }
    }

    res.json({
      success: allAvailable,
      message: allAvailable
        ? "All items available"
        : "Some items not available",
      data: {
        allAvailable,
        items: availability,
      },
    });
  } catch (error) {
    logger.error("Check availability error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking availability",
    });
  }
};
