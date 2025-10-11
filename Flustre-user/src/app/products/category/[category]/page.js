"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "../../../_components/_homepage/ProductCard";
import ProductSidebar from "../../_components/ProductSidebar";
import ProductGrid from "../../_components/ProductGrid";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;

  const [selectedCategory, setSelectedCategory] = useState(
    decodeURIComponent(category)
  );
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 1000, max: 12999 });
  const [sortBy, setSortBy] = useState("Featured");

  // Static product data (same as main products page)
  const staticProducts = [
    {
      id: 1,
      name: "Modern Sofa Set",
      price: 2500,
      originalPrice: 3000,
      discount: 17,
      category: "Living Room",
      image: "/products/sofa.jpg",
      rating: 4.5,
      reviews: 128,
      inStock: true,
      description: "Comfortable 3-seater sofa with modern design"
    },
    {
      id: 2,
      name: "King Size Bed Frame",
      price: 1800,
      originalPrice: 2200,
      discount: 18,
      category: "Bedroom",
      image: "/products/bed.jpg",
      rating: 4.3,
      reviews: 95,
      inStock: true,
      description: "Solid wood king size bed frame with storage"
    },
    {
      id: 3,
      name: "Dining Table Set",
      price: 1200,
      originalPrice: 1500,
      discount: 20,
      category: "Dining & Kitchen",
      image: "/products/dining.jpg",
      rating: 4.7,
      reviews: 67,
      inStock: true,
      description: "6-seater dining table with matching chairs"
    },
    {
      id: 4,
      name: "Office Desk",
      price: 800,
      originalPrice: 1000,
      discount: 20,
      category: "Office",
      image: "/products/desk.jpg",
      rating: 4.2,
      reviews: 43,
      inStock: true,
      description: "Ergonomic office desk with drawers"
    },
    {
      id: 5,
      name: "Garden Chair Set",
      price: 600,
      originalPrice: 750,
      discount: 20,
      category: "Outdoors",
      image: "/products/garden.jpg",
      rating: 4.4,
      reviews: 29,
      inStock: true,
      description: "Weather-resistant outdoor chair set"
    },
    {
      id: 6,
      name: "Coffee Table",
      price: 450,
      originalPrice: 600,
      discount: 25,
      category: "Living Room",
      image: "/products/coffee-table.jpg",
      rating: 4.6,
      reviews: 84,
      inStock: true,
      description: "Glass top coffee table with wooden legs"
    },
    {
      id: 7,
      name: "Wardrobe",
      price: 2200,
      originalPrice: 2800,
      discount: 21,
      category: "Bedroom",
      image: "/products/wardrobe.jpg",
      rating: 4.5,
      reviews: 56,
      inStock: true,
      description: "Large 4-door wardrobe with mirror"
    },
    {
      id: 8,
      name: "Kitchen Island",
      price: 1500,
      originalPrice: 1900,
      discount: 21,
      category: "Dining & Kitchen",
      image: "/products/kitchen-island.jpg",
      rating: 4.8,
      reviews: 72,
      inStock: true,
      description: "Multi-functional kitchen island with storage"
    },
    {
      id: 9,
      name: "Office Chair",
      price: 350,
      originalPrice: 450,
      discount: 22,
      category: "Office",
      image: "/products/office-chair.jpg",
      rating: 4.3,
      reviews: 91,
      inStock: true,
      description: "Ergonomic office chair with lumbar support"
    },
    {
      id: 10,
      name: "Patio Table",
      price: 900,
      originalPrice: 1200,
      discount: 25,
      category: "Outdoors",
      image: "/products/patio-table.jpg",
      rating: 4.4,
      reviews: 38,
      inStock: true,
      description: "Weather-resistant outdoor dining table"
    },
    {
      id: 11,
      name: "TV Stand",
      price: 650,
      originalPrice: 850,
      discount: 24,
      category: "Living Room",
      image: "/products/tv-stand.jpg",
      rating: 4.2,
      reviews: 47,
      inStock: true,
      description: "Modern TV stand with cable management"
    },
    {
      id: 12,
      name: "Nightstand",
      price: 280,
      originalPrice: 350,
      discount: 20,
      category: "Bedroom",
      image: "/products/nightstand.jpg",
      rating: 4.5,
      reviews: 63,
      inStock: true,
      description: "Bedside table with drawer and shelf"
    }
  ];

  // Filter products by selected category
  const products = staticProducts.filter(product => 
    product.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/5">
            <ProductSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDiscount={selectedDiscount}
              setSelectedDiscount={setSelectedDiscount}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-4/5">
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
