import { menuCountEventEmitter, MENU_COUNT_EVENTS } from '../hooks/useMenuCounts';

/**
 * Utility functions to trigger menu count updates throughout the application
 */

// Product related events
export const triggerProductCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.PRODUCT_CREATED);
};

export const triggerProductDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.PRODUCT_DELETED);
};

export const triggerProductUpdated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.PRODUCT_UPDATED);
};

// Order related events
export const triggerOrderCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.ORDER_CREATED);
};

export const triggerOrderUpdated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.ORDER_UPDATED);
};

export const triggerOrderDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.ORDER_DELETED);
};

// Category related events
export const triggerCategoryCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.CATEGORY_CREATED);
};

export const triggerCategoryDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.CATEGORY_DELETED);
};

// Subcategory related events
export const triggerSubcategoryCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.SUBCATEGORY_CREATED);
};

export const triggerSubcategoryDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.SUBCATEGORY_DELETED);
};

// Banner related events
export const triggerBannerCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.BANNER_CREATED);
};

export const triggerBannerDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.BANNER_DELETED);
};

// Label related events
export const triggerLabelCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.LABEL_CREATED);
};

export const triggerLabelDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.LABEL_DELETED);
};

// Coupon related events
export const triggerCouponCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.COUPON_CREATED);
};

export const triggerCouponDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.COUPON_DELETED);
};

// Review related events
export const triggerReviewCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.REVIEW_CREATED);
};

export const triggerReviewDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.REVIEW_DELETED);
};

// Customer related events
export const triggerCustomerCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.CUSTOMER_CREATED);
};

export const triggerCustomerDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.CUSTOMER_DELETED);
};

// Instagram Carousel related events
export const triggerInstaCarouselCreated = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.INSTA_CAROUSEL_CREATED);
};

export const triggerInstaCarouselDeleted = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.INSTA_CAROUSEL_DELETED);
};

// Force refresh all counts
export const triggerForceRefresh = () => {
  menuCountEventEmitter.emit(MENU_COUNT_EVENTS.FORCE_REFRESH);
};
