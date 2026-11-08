
import CarouselImage from "./CarouselImage";
import CarouselNav from "./CarouselNav";

export default function Carousel() {

  return (
    <div className="carousel-container relative overflow-hidden group">
      <CarouselImage/>
      <CarouselNav  />
    </div>
  );
}
