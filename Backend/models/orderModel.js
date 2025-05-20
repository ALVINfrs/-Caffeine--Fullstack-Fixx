const { pool } = require("../config/database");

async function getConnection() {
  return await pool.getConnection();
}

async function createInitialOrder(connection, orderData, items) {
  try {
    const {
      userId,
      customerName,
      email,
      phone,
      address,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status,
    } = orderData;

    // Create initial order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, customer_name, email, phone, address, subtotal, 
        shipping_fee, total, payment_method, order_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        userId,
        customerName,
        email,
        phone,
        address,
        subtotal,
        shipping,
        total,
        paymentMethod,
        status,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, price, quantity, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ]
      );
    }

    // Generate order number
    const orderNumber = `KKS-${orderId}-${Date.now().toString().slice(-6)}`;

    // Update order with order number
    await connection.query("UPDATE orders SET order_number = ? WHERE id = ?", [
      orderNumber,
      orderId,
    ]);

    return {
      orderId,
      orderNumber,
    };
  } catch (error) {
    throw error;
  }
}

async function updateOrderWithSnapInfo(
  connection,
  orderId,
  snapToken,
  redirectUrl
) {
  await connection.query(
    `UPDATE orders 
     SET snap_token = ?, snap_redirect_url = ? 
     WHERE id = ?`,
    [snapToken, redirectUrl, orderId]
  );
}

async function updateOrderStatus(
  orderNumber,
  status,
  transactionId,
  transactionTime,
  vaNumber = null,
  bank = null,
  fraudStatus = null,
  paymentType = null
) {
  const connection = await pool.getConnection();
  try {
    // Updated query to include payment_method update when a real payment type is received
    let query = `
      UPDATE orders 
      SET status = ?, 
          transaction_id = ?, 
          transaction_time = ?, 
          va_number = ?, 
          bank = ?, 
          fraud_status = ?`;

    // Add payment_method update only if paymentType is provided
    if (paymentType) {
      query += `, payment_method = ?`;
    }

    query += ` WHERE order_number = ?`;

    // Prepare parameters based on whether paymentType exists
    const params = paymentType
      ? [
          status,
          transactionId,
          transactionTime,
          vaNumber,
          bank,
          fraudStatus,
          paymentType,
          orderNumber,
        ]
      : [
          status,
          transactionId,
          transactionTime,
          vaNumber,
          bank,
          fraudStatus,
          orderNumber,
        ];

    await connection.query(query, params);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function getOrderById(orderId) {
  const [orders] = await pool.query(`SELECT * FROM orders WHERE id = ?`, [
    orderId,
  ]);

  if (orders.length === 0) {
    return null;
  }

  // Get order items
  const [items] = await pool.query(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [orderId]
  );

  return {
    order: orders[0],
    items: items,
  };
}

async function getUserOrders(userId) {
  const [orders] = await pool.query(
    `SELECT o.*, 
     (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
     FROM orders o 
     WHERE user_id = ? 
     ORDER BY order_date DESC`,
    [userId]
  );

  // Get items for each order
  for (const order of orders) {
    const [items] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    order.items = items;
  }

  return orders;
}

module.exports = {
  getConnection,
  createInitialOrder,
  updateOrderWithSnapInfo,
  updateOrderStatus,
  getOrderById,
  getUserOrders,
};
