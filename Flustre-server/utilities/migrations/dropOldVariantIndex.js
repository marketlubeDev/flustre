const mongoose = require("mongoose");
const Variant = require("../../model/variantsModel");

/**
 * Migration script to drop the old problematic unique index on { product: 1, options: 1 }
 * and ensure the new SKU unique index exists.
 *
 * Run this script once after updating the variant model to fix duplicate key errors.
 *
 * Usage: node utilities/migrations/dropOldVariantIndex.js
 */

async function migrateVariantIndexes() {
  try {
    console.log("Starting variant index migration...");

    // Check if collection exists
    const collections = await mongoose.connection.db
      .listCollections({ name: "variants" })
      .toArray();

    if (collections.length === 0) {
      console.log("⊘ Variants collection does not exist yet.");
      console.log(
        "✓ The new index will be created automatically when variants are first saved."
      );
      console.log("\n✓ Migration completed (no action needed)!");
      return;
    }

    // Get existing indexes
    const indexes = await Variant.collection.getIndexes();
    console.log("Current indexes:", Object.keys(indexes));

    // Drop the old problematic index if it exists
    try {
      await Variant.collection.dropIndex("product_1_options_1");
      console.log("✓ Dropped old index: product_1_options_1");
    } catch (error) {
      if (error.code === 27 || error.codeName === "IndexNotFound") {
        console.log(
          "⊘ Old index product_1_options_1 does not exist (already removed)"
        );
      } else {
        throw error;
      }
    }

    // Ensure the new SKU unique index exists
    await Variant.collection.createIndex(
      { sku: 1 },
      { unique: true, sparse: true }
    );
    console.log("✓ Created/verified SKU unique index");

    // List final indexes
    const finalIndexes = await Variant.collection.getIndexes();
    console.log("\nFinal indexes:");
    Object.keys(finalIndexes).forEach((indexName) => {
      console.log(`  - ${indexName}`);
    });

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    throw error;
  }
}

// If running as a standalone script
if (require.main === module) {
  // Load environment variables
  require("dotenv").config();

  const dbUri =
    process.env.MONGO_URL ||
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/flustre";

  console.log(
    "Using database URI:",
    dbUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")
  ); // Hide password in logs

  mongoose
    .connect(dbUri)
    .then(async () => {
      console.log("Connected to MongoDB");
      await migrateVariantIndexes();
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1);
    });
} else {
  // Export for use in other scripts
  module.exports = migrateVariantIndexes;
}
