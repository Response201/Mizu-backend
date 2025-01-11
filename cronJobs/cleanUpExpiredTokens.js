const Blacklist = require('../models/Blacklist');


// Function to clean up expired tokens from the Blacklist
exports.cleanUpExpiredTokens = async () => {
  try {
   // Remove all tokens where the `expiresAt` date is less than or equal to the current date
    const result = await Blacklist.deleteMany({ expiresAt: { $lte: new Date() } });

        // Log the number of expired tokens removed
    console.log(`${result.deletedCount} inaktuella tokens borttagna.`);
  } catch (error) {
      // Log any errors during the cleanup process
    console.error("Fel vid rensning av gamla tokens i Blacklist:", error);
  }
};