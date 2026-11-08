import teenBoys from "./images/kids/teenBoys.jpg";
import teenGirls from "./images/kids/teenGirls.jpg";
import kidsBoys from "./images/kids/kidBoys.jpg";
import kidsGirls from "./images/kids/kidGirls.jpg";
import { BoysGirlsCategoryProps } from "../types/components/BoysGirlsCategory/BoysGirlsCategory";

export const categories : BoysGirlsCategoryProps[] = [
  { name: "Teen Boys", image: teenBoys, key: "teenboys", subcategories: ["teenboysclothes", "teenboysshoes"] },
  { name: "Teen Girls", image: teenGirls, key: "teengirls", subcategories: ["teengirlsclothes", "teengirlsshoes"] },
  { name: "Kids Boys", image: kidsBoys, key: "kidsboys", subcategories: ["boysshirt", "boysshalwar", "boysshoes"] },
  { name: "Kids Girls", image: kidsGirls, key: "kidsgirls", subcategories: ["girlsclothes", "girlsshirt", "girlsshoes"] }
];
