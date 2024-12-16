const cron = require('node-cron');
const Blacklist = require('../models/Blacklist'); 

/* Rensar all inaktuella tokens i databasen => BlackList*/
cron.schedule('0 3 * * 1', async () => {
      console.log("Rensar inaktuella tokens en gång i veckan på måndag klockan 03:00...");
    const result = await Blacklist.deleteMany({ expiresAt: { $lte: new Date() } });
    console.log(`${result.deletedCount} inaktuella tokens borttagna.`);
});


// Middleware för att rensa gamla tokens
exports.cleanUpBlacklist = async (req, res, next) => {
    await Blacklist.deleteMany({ expiresAt: { $lte: new Date() } });
    next();
};
