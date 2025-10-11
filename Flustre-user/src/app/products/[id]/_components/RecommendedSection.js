"use client";
import Image from "next/image";
import { useRef } from "react";

export default function RecommendedSection() {
  const scrollerRef = useRef(null);

  // Static products data
  const staticProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: "$199.99",
      originalPrice: "$299.99",
      image: "/recommended/recommended1.jpg",
      badge: "#1"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Wearables",
      price: "$149.99",
      originalPrice: "$199.99",
      image: "/recommended/recommended2.jpg",
      badge: "#2"
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      category: "Audio",
      price: "$79.99",
      originalPrice: "$99.99",
      image: "/recommended/recommended3.jpg",
      badge: "#3"
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
      category: "Gaming",
      price: "$129.99",
      originalPrice: "$159.99",
      image: "/recommended/recommended4.jpg",
      
    },
    {
      id: 5,
      name: "Wireless Mouse",
      category: "Accessories",
      price: "$49.99",
      originalPrice: "$69.99",
      image: "/recommended/recommended5.jpg",
      
    },
    {
      id: 6,
      name: "USB-C Hub",
      category: "Accessories",
      price: "$39.99",
      originalPrice: "$59.99",
      image: "/recommended/recommended6.jpg",
 
    }
  ];

  return (
    <section className="bg-white">
      <div className="container mx-auto px-0 md:px-8 lg:px-10 xl:px-0 2xl:px-10 py-4 md:py-6 xl:pb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2
            className="font-bold text-lg md:text-2xl lg:text-3xl text-gray-800"
          >
            Recommended for You
          </h2>
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <span className="text-sm md:text-base">View All</span>
            <span className="inline-flex">
              <Image
                src="/nextarrow.svg"
                alt="Next arrow"
                width={28}
                height={28}
                className="w-5 h-5 md:w-7 md:h-7"
              />
            </span>
          </div>
        </div>

        {/* Products Grid (horizontal scroll like BestSellers) */}
        <div
          ref={scrollerRef}
          className="
            grid grid-flow-col auto-cols-[45%] gap-4 overflow-x-auto pb-2
            sm:auto-cols-[40%] sm:gap-5
            md:auto-cols-[32%] md:gap-4 md:pb-4
            lg:auto-cols-[30%] lg:gap-5
            xl:grid-cols-6 xl:overflow-visible xl:pb-0
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          "
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-primary) #f1f1f1' }}
        >
          {staticProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-none flex flex-col min-w-0 lg:min-h-[360px]"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={180}
                  className="w-full h-36 md:h-40 lg:h-56 xl:h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {product.badge && (
                  <div className="absolute top-1 md:top-2 left-[-16px]">
                    <div className="relative">
                      <Image
                        src="/badge.svg"
                        alt="Badge"
                        width={64}
                        height={40}
                        className="w-12 h-8 md:w-16 md:h-10"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-[10px] md:text-xs font-bold">
                          {product.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 px-1 flex-1 flex flex-col">
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2 line-clamp-2" style={{ lineHeight: "1.1" }}>
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-2 md:mb-3 lg:mb-4" style={{ lineHeight: "1.1" }}>
                  {product.category}
                </p>

                <div className="flex items-center gap-1 md:gap-2 lg:gap-3 mb-0 whitespace-nowrap">
                  <span
                    className="text-xs md:text-sm lg:text-base font-bold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {product.price}
                  </span>
                  <span className="relative inline-flex items-center text-gray-500">
                    <span className="text-[10px] md:text-xs lg:text-sm ml-0">{product.originalPrice}</span>
                    <span aria-hidden="true" className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform h-px bg-gray-700"></span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-b border-gray-200 w-full mt-6" />
      </div>
    </section>
  );
}