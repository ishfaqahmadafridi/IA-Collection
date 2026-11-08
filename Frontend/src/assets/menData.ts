// Import men's product images
import main1 from './images/men-tshirts/imgTmain.webp';
import img1 from './images/men-tshirts/imgT1.webp';
import img2 from './images/men-tshirts/imgT2.webp';
import img3 from './images/men-tshirts/imgT3.webp';
import img4 from './images/men-tshirts/imgT4.webp';


// Peshawari
import mainPeshawari from './images/men-shoes/peshawari(1).jfif';
import imgPesh1 from './images/men-shoes/PESHAWARI(2).jfif';
import imgPesh2 from './images/men-shoes/peshawari(3).jfif';
import imgPesh3 from './images/men-shoes/peshawari(4).jfif';
import imgPesh4 from './images/men-shoes/peshawari(1).jfif';

// Sandal
import mainSandal from './images/men-shoes/scandle(1).jfif';
import imgSand1 from './images/men-shoes/scandle(2).jfif';
import imgSand2 from './images/men-shoes/scandle(3).jfif';
import imgSand3 from './images/men-shoes/scandle(4).jfif';
import imgSand4 from './images/men-shoes/scandle(1).jfif';

// Formal Shoes
import mainShoes from './images/men-shoes/shoes(1).jfif';
import imgSho1 from './images/men-shoes/shoes(2).jfif';
import imgSho2 from './images/men-shoes/shoes(3).jfif';
import imgSho3 from './images/men-shoes/shoes (4).jfif';
import imgSho4 from './images/men-shoes/shoes(1).jfif';

// Chapal
import mainChapal from './images/men-shoes/chapple(1).jfif';
import imgChap1 from './images/men-shoes/chapple(2).jfif';
import imgChap2 from './images/men-shoes/chapple(3).jfif';
import imgChap3 from './images/men-shoes/chapple(4).jfif';
import imgChap4 from './images/men-shoes/chapple(1).jfif';

// Kurta
import mainKurta from './images/men-ethnic/kurta(1).jfif';
import imgK1 from './images/men-ethnic/kurta(2).jfif';
import imgK2 from './images/men-ethnic/kurta(3).jfif';
import imgK3 from './images/men-ethnic/kurta(4).jfif';
import imgK4 from './images/men-ethnic/kurta(1).jfif';

// Shalwar Kameez
import mainShalwar from './images/men-ethnic/shalwar(1).jfif';
import imgSh1 from './images/men-ethnic/shalwar(2).jfif';
import imgSh2 from './images/men-ethnic/shalwar(3).jfif';
import imgSh3 from './images/men-ethnic/shalwar(4).jfif';
import imgSh4 from './images/men-ethnic/shalwar(1).jfif';

// Sherwani
import mainSherwani from './images/men-ethnic/sherwani(1).jfif';
import imgShw1 from './images/men-ethnic/sherwani(2).jfif';
import imgShw2 from './images/men-ethnic/sherwani(3).jfif';
import imgShw3 from './images/men-ethnic/sherwani(4).jfif';
import imgShw4 from './images/men-ethnic/sherwani(1).jfif';

// Coat
import mainCoat from './images/men-ethnic/coat(1).jfif';
import imgC1 from './images/men-ethnic/coat(3).jfif';
import imgC2 from './images/men-ethnic/coat (2).jfif';
import imgC3 from './images/men-ethnic/coat (7).jfif';
import imgC4 from './images/men-ethnic/coat(1).jfif';

import main6 from './images/glasses/men.webp';
import imgG1 from './images/glasses/imgCos1.webp';
import imgG2 from './images/glasses/imgCos2.webp';
import imgG3 from './images/glasses/imgG3.webp';
import imgG4 from './images/glasses/imgCh4.webp';

export const menCategories = [
  {
    id: 'shirts',
    name: 'Shirts',
    heroImage: main1,
    products: [
      {
        id: 1,
        name: "Poly Combric Printed Shirt USTK-285",
        price: 2514,
        originalPrice: 4190,
        discount: "40% OFF",
        sale: true,
        image: img1,
        details: {
          fitType: "Relaxed",
          designDetails: "Striped tunic with batwing sleeves",
          material: "80% Rayon, 20% Nylon",
          modelInfo: "165.1 cm/5'5\" wears size SMALL"
        },
        careInstructions: "Machine wash cold, gentle cycle. Do not bleach. Lay flat to dry."
      },
      {
        id: 2,
        name: "Poly Combric Printed Co-Ord Set IPS",
        price: 3743,
        originalPrice: 4990,
        discount: "25% OFF",
        sale: true,
        image: img2,
        details: {
          fitType: "Regular",
          designDetails: "Printed co-ord set with matching top and bottom",
          material: "100% Polyester",
          modelInfo: "170 cm/5'7\" wears size MEDIUM"
        },
        careInstructions: "Machine wash cold. Tumble dry low."
      },
      {
        id: 3,
        name: "Poly Combric Printed Shirt IPS-44500",
        price: 2243,
        originalPrice: 2990,
        discount: "25% OFF",
        image: img3,
        details: {
          fitType: "Slim",
          designDetails: "Printed shirt with button-down collar",
          material: "65% Polyester, 35% Cotton",
          modelInfo: "168 cm/5'6\" wears size SMALL"
        },
        careInstructions: "Machine wash warm. Do not iron print directly."
      },
      {
        id: 4,
        name: "Poly Combric Printed Shirt IPS-44400",
        price: 2243,
        originalPrice: 2990,
        discount: "25% OFF",
        image: img4,
        details: {
          fitType: "Oversized",
          designDetails: "Printed shirt with drop shoulders",
          material: "70% Polyester, 30% Viscose",
          modelInfo: "172 cm/5'8\" wears size MEDIUM"
        },
        careInstructions: "Hand wash recommended. Lay flat to dry."
      }
    ]
  },
  {
    id: 'peshawari',
    name: 'Peshawari',
    heroImage: mainPeshawari,
    products: [
      {
        id: 501,
        name: "Traditional Peshawari Chappal PSH-001",
        price: 2200,
        originalPrice: 2750,
        discount: "20% OFF",
        image: imgPesh1,
        details: {
          fitType: "Traditional",
          designDetails: "Handcrafted leather chappal with classic design",
          material: "100% Genuine Leather",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Wipe with damp cloth. Apply leather conditioner."
      },
      {
        id: 502,
        name: "Premium Peshawari Chappal PSH-002",
        price: 2800,
        originalPrice: 3500,
        discount: "20% OFF",
        image: imgPesh2,
        details: {
          fitType: "Traditional",
          designDetails: "Double-strap Peshawari with cushioned sole",
          material: "Pure Leather",
          modelInfo: "Sizes 7-12 available"
        },
        careInstructions: "Keep away from water. Polish regularly."
      },
      {
        id: 503,
        name: "Designer Peshawari Chappal PSH-003",
        price: 3200,
        originalPrice: 4000,
        discount: "20% OFF",
        image: imgPesh3,
        details: {
          fitType: "Comfortable",
          designDetails: "Modern Peshawari with decorative stitching",
          material: "Soft Leather",
          modelInfo: "Sizes 6-11 available"
        },
        careInstructions: "Clean with leather cleaner. Air dry."
      },
      {
        id: 504,
        name: "Classic Peshawari Chappal PSH-004",
        price: 2500,
        originalPrice: 3125,
        discount: "20% OFF",
        image: imgPesh4,
        details: {
          fitType: "Traditional",
          designDetails: "Authentic Peshawari with tire sole",
          material: "Buffalo Leather",
          modelInfo: "Sizes 7-12 available"
        },
        careInstructions: "Wipe clean. Store in dry place."
      }
    ]
  },
  {
    id: 'sandal',
    name: 'Sandal',
    heroImage: mainSandal,
    products: [
      {
        id: 401,
        name: "Casual Sandal SND-001",
        price: 1800,
        originalPrice: 2250,
        discount: "20% OFF",
        image: imgSand1,
        details: {
          fitType: "Casual",
          designDetails: "Open-toe sandal with adjustable straps",
          material: "Synthetic Leather",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Wipe with damp cloth. Air dry."
      },
      {
        id: 402,
        name: "Sport Sandal SND-002",
        price: 2200,
        originalPrice: 2750,
        discount: "20% OFF",
        image: imgSand2,
        details: {
          fitType: "Athletic",
          designDetails: "Waterproof sport sandal with grip sole",
          material: "EVA and Rubber",
          modelInfo: "Sizes 6-12 available"
        },
        careInstructions: "Wash with soap and water. Quick dry."
      },
      {
        id: 403,
        name: "Formal Sandal SND-003",
        price: 2600,
        originalPrice: 3250,
        discount: "20% OFF",
        image: imgSand3,
        details: {
          fitType: "Formal",
          designDetails: "Elegant sandal with buckle closure",
          material: "Genuine Leather",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Polish regularly. Avoid moisture."
      },
      {
        id: 404,
        name: "Comfort Sandal SND-004",
        price: 1900,
        originalPrice: 2375,
        discount: "20% OFF",
        image: imgSand4,
        details: {
          fitType: "Relaxed",
          designDetails: "Cushioned sandal with arch support",
          material: "Soft Foam and Fabric",
          modelInfo: "Sizes 6-11 available"
        },
        careInstructions: "Hand wash. Air dry only."
      }
    ]
  },
  {
    id: 'shoes',
    name: 'Shoes',
    heroImage: mainShoes,
    products: [
      {
        id: 301,
        name: "Formal Shoes FSH-001",
        price: 4500,
        originalPrice: 5625,
        discount: "20% OFF",
        image: imgSho1,
        details: {
          fitType: "Classic",
          designDetails: "Polished oxford shoes with lace-up design",
          material: "100% Genuine Leather",
          modelInfo: "Sizes 7-12 available"
        },
        careInstructions: "Polish regularly. Use shoe trees."
      },
      {
        id: 302,
        name: "Dress Shoes FSH-002",
        price: 5200,
        originalPrice: 6500,
        discount: "20% OFF",
        image: imgSho2,
        details: {
          fitType: "Formal",
          designDetails: "Premium dress shoes with cap-toe design",
          material: "Italian Leather",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Professional polish recommended. Store properly."
      },
      {
        id: 303,
        name: "Business Shoes FSH-003",
        price: 4800,
        originalPrice: 6000,
        discount: "20% OFF",
        image: imgSho3,
        details: {
          fitType: "Professional",
          designDetails: "Derby shoes with comfort insole",
          material: "Premium Leather",
          modelInfo: "Sizes 6-12 available"
        },
        careInstructions: "Clean with leather cleaner. Condition monthly."
      },
      {
        id: 304,
        name: "Office Shoes FSH-004",
        price: 4200,
        originalPrice: 5250,
        discount: "20% OFF",
        image: imgSho4,
        details: {
          fitType: "Comfort",
          designDetails: "Slip-on dress shoes with cushioned sole",
          material: "Leather Upper",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Wipe clean. Polish as needed."
      }
    ]
  },
  {
    id: 'chapal',
    name: 'Chapal',
    heroImage: mainChapal,
    products: [
      {
        id: 201,
        name: "Traditional Chapal CHP-001",
        price: 1500,
        originalPrice: 1875,
        discount: "20% OFF",
        image: imgChap1,
        details: {
          fitType: "Traditional",
          designDetails: "Classic handmade chapal with tire sole",
          material: "Leather and Rubber",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Wipe clean. Avoid excessive water."
      },
      {
        id: 202,
        name: "Comfort Chapal CHP-002",
        price: 1800,
        originalPrice: 2250,
        discount: "20% OFF",
        image: imgChap2,
        details: {
          fitType: "Comfort",
          designDetails: "Soft leather chapal with padded footbed",
          material: "Soft Leather",
          modelInfo: "Sizes 6-12 available"
        },
        careInstructions: "Hand clean. Apply leather conditioner."
      },
      {
        id: 203,
        name: "Premium Chapal CHP-003",
        price: 2200,
        originalPrice: 2750,
        discount: "20% OFF",
        image: imgChap3,
        details: {
          fitType: "Premium",
          designDetails: "Designer chapal with decorative stitching",
          material: "Premium Leather",
          modelInfo: "Sizes 7-11 available"
        },
        careInstructions: "Polish regularly. Store properly."
      },
      {
        id: 204,
        name: "Daily Wear Chapal CHP-004",
        price: 1600,
        originalPrice: 2000,
        discount: "20% OFF",
        image: imgChap4,
        details: {
          fitType: "Casual",
          designDetails: "Everyday chapal with durable sole",
          material: "Synthetic Leather",
          modelInfo: "Sizes 7-12 available"
        },
        careInstructions: "Wipe with damp cloth. Air dry."
      }
    ]
  },
  {
    id: 'kurta',
    name: 'Kurta',
    heroImage: mainKurta,
    products: [
      {
        id: 901,
        name: "Traditional Kurta KUR-001",
        price: 3200,
        originalPrice: 4000,
        discount: "20% OFF",
        image: imgK1,
        details: {
          fitType: "Regular",
          designDetails: "Classic kurta with embroidered neckline",
          material: "100% Cotton",
          modelInfo: "Sizes S-XXL available"
        },
        careInstructions: "Machine wash cold. Iron on medium heat."
      },
      {
        id: 902,
        name: "Designer Kurta KUR-002",
        price: 3800,
        originalPrice: 4750,
        discount: "20% OFF",
        image: imgK2,
        details: {
          fitType: "Slim Fit",
          designDetails: "Modern cut with side pockets",
          material: "Cotton Blend",
          modelInfo: "Sizes M-XL available"
        },
        careInstructions: "Hand wash recommended. Dry in shade."
      },
      {
        id: 903,
        name: "Printed Kurta KUR-003",
        price: 2900,
        originalPrice: 3625,
        discount: "20% OFF",
        image: imgK3,
        details: {
          fitType: "Regular",
          designDetails: "Block print design with contrast buttons",
          material: "Pure Cotton",
          modelInfo: "Sizes S-XXL available"
        },
        careInstructions: "Cold wash. Do not bleach."
      },
      {
        id: 904,
        name: "Embroidered Kurta KUR-004",
        price: 4200,
        originalPrice: 5250,
        discount: "20% OFF",
        image: imgK4,
        details: {
          fitType: "Regular",
          designDetails: "Heavy embroidery on front panel",
          material: "Cotton Silk",
          modelInfo: "Sizes M-XXL available"
        },
        careInstructions: "Dry clean only to preserve embroidery."
      }
    ]
  },
  {
    id: 'shalwar',
    name: 'Shalwar Kameez',
    heroImage: mainShalwar,
    products: [
      {
        id: 801,
        name: "Classic Shalwar Kameez SHK-001",
        price: 4500,
        originalPrice: 5625,
        discount: "20% OFF",
        image: imgSh1,
        details: {
          fitType: "Traditional",
          designDetails: "3-piece set with dupatta",
          material: "Premium Cotton",
          modelInfo: "Sizes M-XXL available"
        },
        careInstructions: "Machine wash cold. Iron while damp."
      },
      {
        id: 802,
        name: "Formal Shalwar Kameez SHK-002",
        price: 5200,
        originalPrice: 6500,
        discount: "20% OFF",
        image: imgSh2,
        details: {
          fitType: "Tailored",
          designDetails: "Embroidered collar and cuffs",
          material: "Cotton Silk Blend",
          modelInfo: "Sizes S-XL available"
        },
        careInstructions: "Dry clean recommended."
      },
      {
        id: 803,
        name: "Printed Shalwar Kameez SHK-003",
        price: 3800,
        originalPrice: 4750,
        discount: "20% OFF",
        image: imgSh3,
        details: {
          fitType: "Regular",
          designDetails: "Contemporary print with solid shalwar",
          material: "100% Cotton",
          modelInfo: "Sizes M-XXL available"
        },
        careInstructions: "Cold wash. Tumble dry low."
      },
      {
        id: 804,
        name: "Premium Shalwar Kameez SHK-004",
        price: 6200,
        originalPrice: 7750,
        discount: "20% OFF",
        image: imgSh4,
        details: {
          fitType: "Designer",
          designDetails: "Intricate embroidery with mirror work",
          material: "Silk Cotton",
          modelInfo: "Sizes M-XL available"
        },
        careInstructions: "Dry clean only. Handle with care."
      }
    ]
  },
  {
    id: 'sherwani',
    name: 'Sherwani',
    heroImage: mainSherwani,
    products: [
      {
        id: 701,
        name: "Wedding Sherwani SHW-001",
        price: 12000,
        originalPrice: 15000,
        discount: "20% OFF",
        image: imgShw1,
        details: {
          fitType: "Royal",
          designDetails: "Heavily embroidered with gold thread work",
          material: "Silk Brocade",
          modelInfo: "Custom tailoring available"
        },
        careInstructions: "Dry clean only. Store in garment bag."
      },
      {
        id: 702,
        name: "Designer Sherwani SHW-002",
        price: 9500,
        originalPrice: 11875,
        discount: "20% OFF",
        image: imgShw2,
        details: {
          fitType: "Modern",
          designDetails: "Contemporary cut with traditional embroidery",
          material: "Silk Blend",
          modelInfo: "Sizes 38-46 chest"
        },
        careInstructions: "Professional dry clean recommended."
      },
      {
        id: 703,
        name: "Classic Sherwani SHW-003",
        price: 8200,
        originalPrice: 10250,
        discount: "20% OFF",
        image: imgShw3,
        details: {
          fitType: "Traditional",
          designDetails: "Button-down front with mandarin collar",
          material: "Raw Silk",
          modelInfo: "Sizes 36-48 chest"
        },
        careInstructions: "Dry clean only. Avoid direct sunlight."
      },
      {
        id: 704,
        name: "Premium Sherwani SHW-004",
        price: 15000,
        originalPrice: 18750,
        discount: "20% OFF",
        image: imgShw4,
        details: {
          fitType: "Luxury",
          designDetails: "Hand-embroidered with pearl and stone work",
          material: "Pure Silk",
          modelInfo: "Bespoke tailoring service"
        },
        careInstructions: "Expert dry clean only. Premium care required."
      }
    ]
  },
  {
    id: 'coat',
    name: 'Coat',
    heroImage: mainCoat,
    products: [
      {
        id: 601,
        name: "Traditional Coat COT-001",
        price: 5500,
        originalPrice: 6875,
        discount: "20% OFF",
        image: imgC1,
        details: {
          fitType: "Regular",
          designDetails: "Long ethnic coat with button closure",
          material: "Wool Blend",
          modelInfo: "Sizes M-XXL available"
        },
        careInstructions: "Dry clean only. Store properly in off-season."
      },
      {
        id: 602,
        name: "Designer Waistcoat COT-002",
        price: 3800,
        originalPrice: 4750,
        discount: "20% OFF",
        image: imgC2,
        details: {
          fitType: "Fitted",
          designDetails: "Embroidered waistcoat for formal occasions",
          material: "Silk Brocade",
          modelInfo: "Sizes S-XL available"
        },
        careInstructions: "Dry clean recommended. Iron on low heat."
      },
      {
        id: 603,
        name: "Prince Coat COT-003",
        price: 7200,
        originalPrice: 9000,
        discount: "20% OFF",
        image: imgC3,
        details: {
          fitType: "Royal",
          designDetails: "Jodhpuri-style coat with embellishments",
          material: "Premium Silk",
          modelInfo: "Sizes M-XL available"
        },
        careInstructions: "Professional dry clean only."
      },
      {
        id: 604,
        name: "Formal Coat COT-004",
        price: 6500,
        originalPrice: 8125,
        discount: "20% OFF",
        image: imgC4,
        details: {
          fitType: "Tailored",
          designDetails: "Achkan-style coat with side buttons",
          material: "Cotton Silk",
          modelInfo: "Sizes M-XXL available"
        },
        careInstructions: "Dry clean only. Hang on proper hanger."
      }
    ]
  },
  {
    id: 'glasses',
    name: 'Glasses',
    heroImage: main6,
    products: [
      {
        id: 17,
        name: "Aviator Sunglasses GLS-001",
        price: 1800,
        originalPrice: 2250,
        discount: "20% OFF",
        image: imgG1,
        details: {
          fitType: "Universal",
          designDetails: "Classic metal frame with UV protection",
          material: "Metal and glass lenses",
          modelInfo: "One size fits most"
        },
        careInstructions: "Clean with microfiber cloth. Store in case."
      },
      {
        id: 18,
        name: "Round Frame Glasses GLS-002",
        price: 1600,
        originalPrice: 2000,
        discount: "20% OFF",
        image: imgG2,
        details: {
          fitType: "Narrow",
          designDetails: "Vintage-inspired round frames",
          material: "Acetate",
          modelInfo: "Available in narrow and regular fit"
        },
        careInstructions: "Rinse under water. Dry with soft cloth."
      },
      {
        id: 19,
        name: "Cat-Eye Sunglasses GLS-003",
        price: 2000,
        originalPrice: 2500,
        discount: "20% OFF",
        image: imgG3,
        details: {
          fitType: "Wide",
          designDetails: "Feminine cat-eye shape with gradient lenses",
          material: "Acetate and polycarbonate",
          modelInfo: "Available in two sizes"
        },
        careInstructions: "Avoid leaving in hot cars. Store properly."
      },
      {
        id: 20,
        name: "Rectangular Reading Glasses GLS-004",
        price: 1500,
        originalPrice: 1875,
        discount: "20% OFF",
        image: imgG4,
        details: {
          fitType: "Regular",
          designDetails: "Thin metal frames with blue light filter",
          material: "Stainless steel",
          modelInfo: "Available in various prescriptions"
        },
        careInstructions: "Use both hands to put on/take off."
      }
    ]
  }
];
