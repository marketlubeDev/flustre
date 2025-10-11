import { useQuery } from "@tanstack/react-query";
import { fetchInstaCarouselVideos } from "../services/instaCarouselService";

export const instaCarouselQueryKey = (params) => [
  "insta-carousel",
  { isActive: true, sort: "recent", ...(params || {}) },
];

export default function useInstaCarousel(params) {
  return useQuery({
    queryKey: instaCarouselQueryKey(params),
    queryFn: ({ signal, queryKey }) => {
      const [, p] = queryKey;
      return fetchInstaCarouselVideos({ signal, ...p });
    },
    staleTime: 60 * 1000,
  });
}
