import { carouselImages } from "../../assets/carouselData";
import { useCarouselStore } from "../../stores/carousel/carouselStore";

export default function CarouselImage() {
    const currentIndex = useCarouselStore((state) => state.currentIndex);
    const currentImage = carouselImages[currentIndex];
  return (
    <img
      src={currentImage.src}
      alt={currentImage.alt}
      className="carousel-image"
    />
  );
}
