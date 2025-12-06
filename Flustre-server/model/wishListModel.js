const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishListItemSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: {
            type: Schema.Types.ObjectId,
            ref: "Variant",
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const wishListSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [wishListItemSchema],
        totalItems: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

// Method to calculate total items
wishListSchema.methods.calculateTotalItems = function () {
    this.totalItems = this.items.length;
    return this.totalItems;
};

// Pre-save hook to update totalItems
wishListSchema.pre("save", function (next) {
    this.totalItems = this.items.length;
    next();
});

// Index for faster queries
wishListSchema.index({ user: 1 });
wishListSchema.index({ "items.product": 1 });

module.exports = mongoose.model("WishList", wishListSchema);

