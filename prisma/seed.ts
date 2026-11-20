import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DEMO_USER_ID = "demo-user-alex";

export const mockProfiles = [
  {
    userId: "user-maya-24",
    name: "Maya",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "Coffee enthusiast, ceramicist on weekends, and chronic over-thinker about brutalist architecture. Looking for someone to explore hidden bookshops with.",
    cityOrCollege: "Brooklyn, NY • Pratt Institute",
    interests: ["Ceramics", "Modern Art", "Natural Wine", "Indie Cinema", "Vinyl Records"],
    hasLikedDemoUser: true, // Deterministically matches when swiped right
  },
  {
    userId: "user-elena-25",
    name: "Elena",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    bio: "Looking for someone to test eccentric dinner recipes on. Pottery studio regular and 35mm film photographer.",
    cityOrCollege: "Lower East Side, NY • NYU Tisch",
    interests: ["Pottery", "Film Noir", "Sourdough", "Thrifting", "Analogue Photography"],
    hasLikedDemoUser: false, // Does not create match
  },
  {
    userId: "user-julian-26",
    name: "Julian",
    age: 26,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Architect by day, espresso snob by morning. Always looking for the next best pour-over spot or minimalist gallery opening.",
    cityOrCollege: "SoHo, NY • Columbia GSAPP",
    interests: ["Architecture", "Specialty Coffee", "Cycling", "Typography", "Jazz"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-sophie-23",
    name: "Sophie",
    age: 23,
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    bio: "Graphic designer who loves typography puns and farmers markets. Currently learning Japanese and making sourdough focaccia.",
    cityOrCollege: "Williamsburg, NY • Parsons School of Design",
    interests: ["Typography", "Modern Art", "Graphic Design", "Baking", "Ramen"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-marcus-27",
    name: "Marcus",
    age: 27,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Documentary sound designer. I can tell you the best acoustic spots in Central Park. Let's trade favorite obscure albums.",
    cityOrCollege: "Greenpoint, NY • Berklee",
    interests: ["Vinyl Records", "Field Recording", "Matcha", "Synthesizers", "Botany"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-noah-25",
    name: "Noah",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    bio: "Writer working on short fiction. I make a very respectable spicy vodka rigatoni and love rainy Sunday gallery walks.",
    cityOrCollege: "West Village, NY • The New School",
    interests: ["Creative Writing", "Natural Wine", "Cooking", "Bookshops", "Indie Cinema"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-liam-28",
    name: "Liam",
    age: 28,
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    bio: "Landscape architect passionate about urban rewilding. You'll usually find me bouldering or browsing second-hand furniture.",
    cityOrCollege: "DUMBO, NY • Cornell University",
    interests: ["Bouldering", "Urban Ecology", "Design", "Mid-Century Modern", "Plant Care"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-kai-24",
    name: "Kai",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    bio: "Industrial designer turning recycled plastics into lamps. Let's make pour-over and critique product packaging.",
    cityOrCollege: "Bushwick, NY • RISD",
    interests: ["Industrial Design", "Sustainability", "Specialty Coffee", "Skateboarding", "3D Printing"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-chloe-24",
    name: "Chloe",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    bio: "Curator in training. Fascinated by textile art and mid-century modern furniture. High probability of dragging you to a flea market.",
    cityOrCollege: "Chelsea, NY • Hunter College",
    interests: ["Modern Art", "Vintage Fashion", "Museums", "Coffee", "Ceramics"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-theo-27",
    name: "Theo",
    age: 27,
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    bio: "Sommelier at a neighborhood wine bar. Tell me your favorite comfort meal and I'll find the perfect orange wine pairing.",
    cityOrCollege: "Nolita, NY • Culinary Institute",
    interests: ["Natural Wine", "Cooking", "Tasting Menus", "Film Photography", "Jazz"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-amelia-25",
    name: "Amelia",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    bio: "Botanical illustrator. Plant collector with over 40 species in my studio apartment. Tea lover and avid reader.",
    cityOrCollege: "Cobble Hill, NY • Cooper Union",
    interests: ["Illustration", "Botany", "Herbal Tea", "Watercolors", "Reading"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-lucas-26",
    name: "Lucas",
    age: 26,
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
    bio: "Mobile app developer who also makes wooden spoons. Enthusiast of good typography, bad dad jokes, and cold brews.",
    cityOrCollege: "Crown Heights, NY • Carnegie Mellon",
    interests: ["Woodworking", "Software", "Typography", "Cold Brew", "Biking"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-isla-22",
    name: "Isla",
    age: 22,
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    bio: "Film studies senior. Obsessed with French New Wave and Wong Kar-wai. Seeking cinema partner for late night double features.",
    cityOrCollege: "Astoria, NY • NYU",
    interests: ["Indie Cinema", "French Cinema", "Film Photography", "Matcha", "Writing"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-gabriel-28",
    name: "Gabriel",
    age: 28,
    photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    bio: "Art restorer specializing in renaissance oil paintings. Quiet observer, enthusiastic home cook, and classical music nerd.",
    cityOrCollege: "Upper West Side, NY • Columbia",
    interests: ["Art History", "Oil Painting", "Classical Music", "Cooking", "Antique Books"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-mia-23",
    name: "Mia",
    age: 23,
    photoUrl: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=800&q=80",
    bio: "Ballet dancer transitioning to contemporary choreography. Always down for late night diner pancakes and honest conversations.",
    cityOrCollege: "Fort Greene, NY • Juilliard",
    interests: ["Contemporary Dance", "Yoga", "Vinyl Records", "Diners", "Thrifting"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-ethan-24",
    name: "Ethan",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    bio: "Music producer & multi-instrumentalist. Collecting analog synths and making beats out of kitchen noises.",
    cityOrCollege: "Ridgewood, NY • Brooklyn College",
    interests: ["Synthesizers", "Vinyl Records", "Music Production", "Coffee", "Cycling"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-olivia-25",
    name: "Olivia",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
    bio: "Environmental journalist. Love writing about ocean conservation and foraging wild mushrooms in upstate New York.",
    cityOrCollege: "Bed-Stuy, NY • Columbia Journalism",
    interests: ["Journalism", "Ecology", "Foraging", "Hiking", "Natural Wine"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-sam-27",
    name: "Sam",
    age: 27,
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    bio: "Urban planner focused on bike lanes and pedestrian plazas. Passionate about city living and sourdough pizza.",
    cityOrCollege: "Prospect Heights, NY • Pratt",
    interests: ["Urban Planning", "Cycling", "Pizza", "Architecture", "Photography"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-hannah-26",
    name: "Hannah",
    age: 26,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    bio: "Independent bookstore manager. Ask me for recommendations based on what emotional state you want to experience.",
    cityOrCollege: "Park Slope, NY • Sarah Lawrence",
    interests: ["Bookshops", "Literature", "Tea", "Poetry", "Stationery"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-daniel-29",
    name: "Daniel",
    age: 29,
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    bio: "Ceramics teacher and tea ceremony practitioner. I appreciate intentional spaces, slow mornings, and good conversation.",
    cityOrCollege: "Red Hook, NY • Alfred Ceramics",
    interests: ["Ceramics", "Tea Ceremony", "Meditation", "Woodworking", "Cooking"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-camila-24",
    name: "Camila",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    bio: "Printmaker and risograph publisher. Running a small press for emerging poets. Let's make zines and drink espresso.",
    cityOrCollege: "Greenpoint, NY • Cooper Union",
    interests: ["Risograph", "Printmaking", "Zines", "Espresso", "Modern Art"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-leo-25",
    name: "Leo",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Soundtrack composer. When not at my piano, I'm finding obscure indie films or perfecting my handmade pasta.",
    cityOrCollege: "Boerum Hill, NY • Manhattan School of Music",
    interests: ["Film Scoring", "Piano", "Handmade Pasta", "Indie Cinema", "Wine"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-ava-23",
    name: "Ava",
    age: 23,
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    bio: "Museum educator and amateur astronomer. Can point out constellations from a rooftop or critique modern sculptures.",
    cityOrCollege: "Morningside Heights, NY • Barnard College",
    interests: ["Astronomy", "Museums", "Modern Art", "Rooftops", "Reading"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-felix-27",
    name: "Felix",
    age: 27,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Curator of rare books and manuscripts. I know which century a book is from by the smell of its paper.",
    cityOrCollege: "Brooklyn Heights, NY • NYU",
    interests: ["Rare Books", "History", "Coffee", "Fountain Pens", "Chess"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-ruby-24",
    name: "Ruby",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    bio: "Editorial photographer. Always carrying a Contax T2. Looking for somebody who doesn't mind being my muse.",
    cityOrCollege: "Chinatown, NY • SVA",
    interests: ["Analogue Photography", "Fashion", "Vinyl Records", "Dim Sum", "Cinema"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-oscar-28",
    name: "Oscar",
    age: 28,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    bio: "Coffee roaster and coffee shop co-owner. Will gladly teach you everything about Ethiopian natural processes.",
    cityOrCollege: "East Williamsburg, NY • Barista Guild",
    interests: ["Specialty Coffee", "Coffee Roasting", "Travel", "Running", "Vinyl"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-clara-25",
    name: "Clara",
    age: 25,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    bio: "Exhibition designer. I make interactive spaces for museums. Huge fan of flea market finds and matcha lattes.",
    cityOrCollege: "Williamsburg, NY • Pratt",
    interests: ["Exhibition Design", "Matcha", "Thrifting", "Ceramics", "Modern Art"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-hugo-26",
    name: "Hugo",
    age: 26,
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    bio: "Set designer for independent theatre. Lover of dramatic lighting, cozy knit sweaters, and long train rides.",
    cityOrCollege: "Sunnyside, NY • Yale Drama",
    interests: ["Set Design", "Theatre", "Architecture", "Trains", "Reading"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-sienna-23",
    name: "Sienna",
    age: 23,
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    bio: "Jewelry metalsmith crafting whimsical silver rings. Let's wander through gem fairs and drink iced hojicha.",
    cityOrCollege: "Tribeca, NY • FIT",
    interests: ["Jewelry Design", "Metalsmithing", "Hojicha", "Art Galleries", "Pottery"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-arthur-29",
    name: "Arthur",
    age: 29,
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
    bio: "Vintage furniture restorer. Giving mid-century Danish chairs a second life. Big believer in timeless craftsmanship.",
    cityOrCollege: "Gowanus, NY • Pratt Institute",
    interests: ["Mid-Century Design", "Woodworking", "Jazz", "Espresso", "Flea Markets"],
    hasLikedDemoUser: false,
  },
  {
    userId: "user-lily-24",
    name: "Lily",
    age: 24,
    photoUrl: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=800&q=80",
    bio: "Botanist specializing in indoor tropical plants. Can revive almost any sad plant you've given up on.",
    cityOrCollege: "Clinton Hill, NY • Brooklyn Botanic Garden",
    interests: ["Botany", "Houseplants", "Gardening", "Tea", "Biking"],
    hasLikedDemoUser: true,
  },
  {
    userId: "user-zara-26",
    name: "Zara",
    age: 26,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    bio: "Sustainable fashion researcher. Big fan of brutalist architecture, cardamom buns, and long city walks with zero destination.",
    cityOrCollege: "East Village, NY • FIT",
    interests: ["Sustainable Fashion", "Architecture", "Pastries", "Podcasts", "Modern Art"],
    hasLikedDemoUser: true,
  },
];

export async function seedDatabase(client: PrismaClient = prisma) {
  console.log("Seeding database for Coy Discover...");

  // Clean existing data
  await client.match.deleteMany({});
  await client.swipe.deleteMany({});
  await client.profile.deleteMany({});
  await client.user.deleteMany({});

  // 1. Create Demo User
  const demoUser = await client.user.create({
    data: {
      id: DEMO_USER_ID,
      name: "Alex",
      profile: {
        create: {
          name: "Alex",
          age: 24,
          photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          bio: "Designer, explorer of cozy corners and good playlists.",
          cityOrCollege: "Brooklyn, NY • Pratt Institute",
          interests: JSON.stringify(["Modern Art", "Ceramics", "Vinyl Records"]),
        },
      },
    },
  });

  // 2. Seed 32 Mock Profiles
  let incomingLikesCount = 0;
  for (const item of mockProfiles) {
    const user = await client.user.create({
      data: {
        id: item.userId,
        name: item.name,
        profile: {
          create: {
            name: item.name,
            age: item.age,
            photoUrl: item.photoUrl,
            bio: item.bio,
            cityOrCollege: item.cityOrCollege,
            interests: JSON.stringify(item.interests),
          },
        },
      },
    });

    // 3. Pre-seed incoming like if specified
    if (item.hasLikedDemoUser) {
      await client.swipe.create({
        data: {
          swiperId: user.id,
          targetId: DEMO_USER_ID,
          action: "like",
        },
      });
      incomingLikesCount++;
    }
  }

  console.log(`Seeded ${mockProfiles.length} profiles successfully!`);
  console.log(`Pre-seeded ${incomingLikesCount} incoming likes towards demo user (${DEMO_USER_ID}).`);
}

// Auto-run if executed directly as script
const isMainScript = process.argv[1]?.replace(/\\/g, "/").includes("prisma/seed.ts");
if (isMainScript && !process.env.VITEST) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
