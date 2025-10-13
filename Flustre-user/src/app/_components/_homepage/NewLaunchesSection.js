"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// NewLaunchCard component - inline to avoid separate file dependency
function NewLaunchCard({ product, onClick }) {
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      onClick={() => onClick(product.id)}
    >
      {/* Product Image with overlay and text */}
      <div className="relative w-full h-[240px] rounded-t-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x250?text=New+Launch";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="text-[13px] font-semibold mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[11px] text-white/60 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewLaunchesSection() {
  const router = useRouter();

  // New launches products data with proper IDs for navigation
  const newLaunchesProducts = [
    {
      id: "13",
      name: "The Answer Super Shampoo",
      description: "Hydrolyzed Keratin & Ceramide Formula",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured1+(1).jpg",
    },
    {
      id: "14",
      name: "Newest Onion Protein Shampoo",
      description: "Almond & Onion Ultra Nourishing",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured2+(1).jpg",
    },
    {
      id: "15",
      name: "Flakes Anti-Dandruff Shampoo",
      description: "Professional Anti-Dandruff Formula",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured3+(1).jpg",
    },
    {
      id: "16",
      name: "Redken Anti-Dandruff Shampoo",
      description: "Professional Hair Care Formula",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured4+(1).jpg",
    },
    {
      id: "17",
      name: "Kerastase Repair Shampoo",
      description: "Fiber-strengthening care for damaged hair",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured5+(1).jpg",
    },
    {
      id: "18",
      name: "Moroccanoil Hydrating Shampoo",
      description: "Argan oil infused moisture balance",
      image: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/featured/featured6+(1).jpg",
    },
   
  ];

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="py-8 container mx-auto px-4 md:px-8 lg:px-10 xl:px-10 2xl:px-10">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-[28px] font-bold text-gray-800">
            New Launches
          </h2>
        </div>

        {/* Unified Responsive Grid with Mobile Scrolling */}
        <div className="flex sm:grid sm:grid-cols-3 md:flex lg:flex xl:grid xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 overflow-x-auto sm:overflow-x-visible md:overflow-x-auto lg:overflow-x-auto xl:overflow-x-visible pb-4 sm:pb-0 md:pb-4 lg:pb-4 xl:pb-0 scrollbar-hide sm:scrollbar-auto md:scrollbar-auto lg:scrollbar-auto xl:scrollbar-auto">
          {newLaunchesProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-full md:w-[200px] lg:w-[200px] xl:w-full">
              <NewLaunchCard 
                product={product} 
                onClick={handleProductClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for utilities */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-primary {
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary, #007bff) #f1f1f1;
        }
        
        .scrollbar-primary::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-primary::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .scrollbar-primary::-webkit-scrollbar-thumb {
          background: var(--color-primary, #007bff);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}