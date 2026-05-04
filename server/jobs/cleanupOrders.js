const cron = require('node-cron')
const Order = require('../models/Order')

const startCleanupJob = () => {
  // Runs every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago

      const result = await Order.deleteMany({
        status: 'pending_payment',
        createdAt: { $lt: cutoff }
      })

      if (result.deletedCount > 0) {
        console.log(`[Cron] Deleted ${result.deletedCount} unpaid pending orders`)
      }
    } catch (err) {
      console.error('[Cron] Cleanup failed:', err.message)
    }
  })

  console.log('[Cron] Order cleanup job scheduled')
}

module.exports = startCleanupJob