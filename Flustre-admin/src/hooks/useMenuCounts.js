import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { listProducts } from '../sevices/ProductApis';
import { getOrderStats } from '../sevices/OrderApis';
import { adminUtilities } from '../sevices/adminApis';
import { getBanners } from '../sevices/bannerApis';
import { getAllLabels } from '../sevices/labelApis';
import { getAllCoupons } from '../sevices/couponApi';
import { getInstaCarouselVideos } from '../sevices/instaCarouselApis';
import { axiosInstance } from '../axios/axiosInstance';

// Global event system for count updates
class MenuCountEventEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit(eventType, data) {
    this.listeners.forEach(listener => listener(eventType, data));
  }
}

export const menuCountEventEmitter = new MenuCountEventEmitter();

// Event types
export const MENU_COUNT_EVENTS = {
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_UPDATED: 'ORDER_UPDATED',
  ORDER_DELETED: 'ORDER_DELETED',
  CATEGORY_CREATED: 'CATEGORY_CREATED',
  CATEGORY_DELETED: 'CATEGORY_DELETED',
  SUBCATEGORY_CREATED: 'SUBCATEGORY_CREATED',
  SUBCATEGORY_DELETED: 'SUBCATEGORY_DELETED',
  BANNER_CREATED: 'BANNER_CREATED',
  BANNER_DELETED: 'BANNER_DELETED',
  LABEL_CREATED: 'LABEL_CREATED',
  LABEL_DELETED: 'LABEL_DELETED',
  COUPON_CREATED: 'COUPON_CREATED',
  COUPON_DELETED: 'COUPON_DELETED',
  REVIEW_CREATED: 'REVIEW_CREATED',
  REVIEW_DELETED: 'REVIEW_DELETED',
  CUSTOMER_CREATED: 'CUSTOMER_CREATED',
  CUSTOMER_DELETED: 'CUSTOMER_DELETED',
  INSTA_CAROUSEL_CREATED: 'INSTA_CAROUSEL_CREATED',
  INSTA_CAROUSEL_DELETED: 'INSTA_CAROUSEL_DELETED',
  FORCE_REFRESH: 'FORCE_REFRESH'
};

const useMenuCounts = () => {
  const location = useLocation();
  const [menuCounts, setMenuCounts] = useState({
    products: null,
    orders: null,
    categories: null,
    subcategories: null,
    banners: null,
    labels: null,
    coupons: null,
    customers: null,
    reviews: null,
    instaCarousel: null,
  });

  const fetchCounts = useCallback(async () => {
    try {
      const [
        productsRes,
        orderStatsRes,
        adminUtilsRes,
        bannersRes,
        labelsRes,
        couponsRes,
        usersRes,
        reviewsRes,
        instaCarouselRes,
      ] = await Promise.all([
        listProducts(1, 1, {}),
        getOrderStats(),
        adminUtilities(),
        getBanners(),
        getAllLabels(),
        getAllCoupons(),
        axiosInstance.get("/user/list"),
        axiosInstance.get("/review/get-all-reviews"),
        getInstaCarouselVideos({}),
      ]);

      const productsCount = productsRes?.data?.data?.totalProducts ?? 0;
      const statsObj = orderStatsRes?.stats || orderStatsRes || {};
      const statusCounts = statsObj?.statusCounts || {};
      const ordersCount = Object.values(statusCounts).reduce(
        (sum, n) => sum + (Number(n) || 0),
        0
      );
      const categoriesCount = adminUtilsRes?.data?.categories?.length ?? 0;
      const subcategoriesCount =
        adminUtilsRes?.data?.subcategories?.length ?? 0;
      const bannersData = bannersRes?.data;
      const bannersCount = Array.isArray(bannersData)
        ? bannersData.length
        : bannersData?.data?.length ?? 0;
      const labelsCount =
        labelsRes?.envelop?.data?.length ?? labelsRes?.data?.length ?? 0;
      const couponsCount = couponsRes?.coupons?.length ?? 0;
      const customersCount = usersRes?.data?.pagination?.totalUsers ?? 0;
      const reviewsCount = reviewsRes?.data?.reviews?.length ?? 0;
      const instaCarouselData = instaCarouselRes?.data;
      const instaCarouselCount = Array.isArray(instaCarouselData)
        ? instaCarouselData.length
        : instaCarouselData?.data?.length ?? 0;

      setMenuCounts({
        products: productsCount,
        orders: ordersCount,
        categories: categoriesCount,
        subcategories: subcategoriesCount,
        banners: bannersCount,
        labels: labelsCount,
        coupons: couponsCount,
        customers: customersCount,
        reviews: reviewsCount,
        instaCarousel: instaCarouselCount,
      });
    } catch (error) {
      console.error('Error fetching menu counts:', error);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Listen to global events for real-time updates
  useEffect(() => {
    const unsubscribe = menuCountEventEmitter.subscribe((eventType, data) => {
      // Handle specific events that affect counts
      const countAffectingEvents = [
        MENU_COUNT_EVENTS.PRODUCT_CREATED,
        MENU_COUNT_EVENTS.PRODUCT_DELETED,
        MENU_COUNT_EVENTS.ORDER_CREATED,
        MENU_COUNT_EVENTS.ORDER_UPDATED,
        MENU_COUNT_EVENTS.ORDER_DELETED,
        MENU_COUNT_EVENTS.CATEGORY_CREATED,
        MENU_COUNT_EVENTS.CATEGORY_DELETED,
        MENU_COUNT_EVENTS.SUBCATEGORY_CREATED,
        MENU_COUNT_EVENTS.SUBCATEGORY_DELETED,
        MENU_COUNT_EVENTS.BANNER_CREATED,
        MENU_COUNT_EVENTS.BANNER_DELETED,
        MENU_COUNT_EVENTS.LABEL_CREATED,
        MENU_COUNT_EVENTS.LABEL_DELETED,
        MENU_COUNT_EVENTS.COUPON_CREATED,
        MENU_COUNT_EVENTS.COUPON_DELETED,
        MENU_COUNT_EVENTS.REVIEW_CREATED,
        MENU_COUNT_EVENTS.REVIEW_DELETED,
        MENU_COUNT_EVENTS.CUSTOMER_CREATED,
        MENU_COUNT_EVENTS.CUSTOMER_DELETED,
        MENU_COUNT_EVENTS.INSTA_CAROUSEL_CREATED,
        MENU_COUNT_EVENTS.INSTA_CAROUSEL_DELETED,
        MENU_COUNT_EVENTS.FORCE_REFRESH
      ];

      if (countAffectingEvents.includes(eventType)) {
        // Debounce the refresh to avoid multiple rapid calls
        setTimeout(() => {
          fetchCounts();
        }, 100);
      }
    });

    return unsubscribe;
  }, [fetchCounts]);

  // Update counts when navigating to main admin pages
  useEffect(() => {
    const currentPath = location.pathname;
    const adminPages = [
      '/admin',
      '/admin/product',
      '/admin/order', 
      '/admin/category',
      '/admin/subcategory',
      '/admin/banner',
      '/admin/label',
      '/admin/coupon',
      '/admin/insta-carousel',
      '/admin/review',
      '/admin/customer'
    ];
    
    const isMainAdminPage = adminPages.some(page => 
      currentPath === page || currentPath.startsWith(page + '/')
    );
    
    if (isMainAdminPage) {
      fetchCounts();
    }
  }, [location.pathname, fetchCounts]);

  return { menuCounts, refreshCounts: fetchCounts };
};

export default useMenuCounts;
