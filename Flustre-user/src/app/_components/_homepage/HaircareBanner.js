import Image from 'next/image';

export default function HaircareBanner() {
  return (
    <div className="py-8 container mx-auto px-4 md:px-8 lg:px-10 xl:px-10 2xl:px-10">
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src="https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/Banners/Banne.jpeg"
          alt="Haircare Banner"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </div>
  );
}