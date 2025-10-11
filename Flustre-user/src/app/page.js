"use client";
import Footer from "@/layout/user/Footer";
import BestSellersSection from "./_components/_homepage/bestSeller/BestSellersSection";
import CategorySection from "./_components/_homepage/categroy/CategorySection";
import FeaturedProductsSection from "./_components/_homepage/featuredproduct/FeaturedProductsSection";
import HeroBanner from "./_components/_homepage/hero/HeroBanner";
import PromotionalBanner from "./_components/_homepage/promotion/PromotionalBanner";
import ServiceBenefits from "./_components/_homepage/service/ServiceBenefits";
import CrystalClearBanner from "./_components/_homepage/promotion/CrystalClearBanner";
import EngineeredBy7Hz from "./_components/_homepage/EngineeredBy7Hz";
import InstagramSection from "./_components/_homepage/InstagramSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <CategorySection />
      <BestSellersSection />
      <ServiceBenefits />
      <PromotionalBanner />
      <FeaturedProductsSection />
      <CrystalClearBanner />
      <EngineeredBy7Hz />
      <InstagramSection />
      {/* <Footer /> */}
    </div>
  );
}
