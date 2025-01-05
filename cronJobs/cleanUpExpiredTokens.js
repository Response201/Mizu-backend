const Blacklist = require('../models/Blacklist');


// Funktion för att rensa inaktuella tokens från Blacklist
exports.cleanUpExpiredTokens = async () => {
  try {
    console.log("Rensar inaktuella tokens från Blacklist...");

    // Ta bort alla tokens vars expiresAt är äldre än nu
    const result = await Blacklist.deleteMany({ expiresAt: { $lte: new Date() } });

    console.log(`${result.deletedCount} inaktuella tokens borttagna.`);
  } catch (error) {
    console.error("Fel vid rensning av gamla tokens i Blacklist:", error);
  }
};