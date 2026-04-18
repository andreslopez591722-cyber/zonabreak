const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, default: 'general' },
    price: { type: Number, required: true },
    emoji: { type: String, default: '🍽️' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    stockDeduct: [
      {
        ingredientKey: String,
        amount: Number,
        unit: { type: String, enum: ['g', 'kg', 'unidad', 'ml', 'litro'], default: 'unidad' },
      },
    ],
  },
  { timestamps: true }
);

const inventorySchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    unit: { type: String, default: 'kg' },
    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    costPerUnit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    percentage: { type: Number, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const deliveryPersonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
  emoji: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    source: { type: String, enum: ['pos', 'web', 'rappi'], default: 'pos' },
    channel: {
      type: String,
      enum: ['local', 'rappi', 'domicilio_interno', 'menu_web'],
      default: 'local',
    },
    deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson', default: null },
    deliveryStaffName: { type: String, default: '' },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Efectivo' },
    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'confirmed' },
    createdBy: { type: String, default: 'POS' },
  },
  { timestamps: true }
);

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'otro' },
    paymentMethod: { type: String, default: 'Efectivo' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = {
  Product: mongoose.model('Product', productSchema),
  Inventory: mongoose.model('Inventory', inventorySchema),
  Partner: mongoose.model('Partner', partnerSchema),
  DeliveryPerson: mongoose.model('DeliveryPerson', deliveryPersonSchema),
  Order: mongoose.model('Order', orderSchema),
  Expense: mongoose.model('Expense', expenseSchema),
  Settings: mongoose.model('Settings', settingsSchema),
};
