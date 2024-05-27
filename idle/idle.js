//////////////// -- SECTION: Game Data Defaults -- ////////////////
const OCEAN_ROD_PRICE = 20000;
const ABYSS_ROD_PRICE = 32e7;
const PREHIST_ROD_PRICE = 5e11;
const GALACTIC_ROD_PRICCE = 99e14;

const COMMON_BASE_THRESH = 0.5;
const UNCOMMON_BASE_THRESH = 0.85;
const RARE_BASE_THRESH = 0.95;
const SUPERRARE_BASE_THRESH = 0.99;
const LEGENDARY_BASE_THRESH = 0.9995;

function initialState() {
    let state = {
        funds: 0.0,
        tot_fish: 0,
        bucket_size: 5,
        buckets_per_sec: 0.0,
        stats: {},
        //fish_logs: [],
        inventory: [
            {
                name: "hand-me-down rod",
                description: "It catches fish! ...that's about the end of its positive traits. Catches river fish.",
                location: "river",
                price: 0,
                state: "equipped"
            },
            {
                name: "reef-scraper 5000",
                description: "This rod allows you to plumb greater depths for a true saltwater bounty. Catches ocean fish.",
                location: "ocean",
                price: OCEAN_ROD_PRICE,
                state: "unpurchased"
            },
            {
                name: "abyss-o-matic",
                description: "In the darkest depths of the oceans, where even light does not dare to reach, true riches exist. Catches abyssal fish.",
                location: "abyss",
                price: ABYSS_ROD_PRICE,
                state: "unpurchased"
            },
            {
                name: "aasimovian tacklebox",
                description: "This peculiar invention allows you to cast your line through the fabric of spacetime to catch fish hither-to unknown to humankind. Catches pre-historic fish.",
                location: "prehistoric",
                price: PREHIST_ROD_PRICE,
                state: "unpurchased"
            },
            {
                name: "rod that goes up",
                description: "Unlike most fishing rods, which generally adhere to the theory of gravity, this rod goes up. The implications of this remain to be seen. Catches galactic fish.",
                location: "galactic",
                price: GALACTIC_ROD_PRICCE,
                state: "unpurchased"
            },
        ],
        current_rod: undefined,
        rarity_drop_rate: [
            {rarity: "common", thresh: COMMON_BASE_THRESH},
            {rarity: "uncommon", thresh: UNCOMMON_BASE_THRESH},
            {rarity: "rare", thresh: RARE_BASE_THRESH},
            {rarity: "superrare", thresh: SUPERRARE_BASE_THRESH},
            {rarity: "legendary", thresh: LEGENDARY_BASE_THRESH},
            {rarity: "absurd", thresh: 1.00}, // fallback
        ],
        upgrades: {
            fishingrobots: {
                applyLevel: function(target, original) {
                    function fpsFunc(x) {
                        if (x === 0) return 0;
                        return (x + 20) / 200;
                    }
                    function costFunc(x) {
                        return 250 * ((1 + 1/3) ** x);
                    }
        
                    modifyFishPerSec(fpsFunc(target) - fpsFunc(original));
                    this.cost = costFunc(target);
                    this.level = target;
                    updateShopListing("fishing-robots", this);
                },
                cost: 250.0,
                level: 0,
                levelMax: 20,
            },
            iceboxes: {
                applyLevel: function(target, original) {
                    function priceEnhanceFunc(target, original) {
                        if (original > target) return 1.0;
                        let diff = target - original;
                        return Math.pow(1.1, Math.floor(diff));
                    }
                    function costFunc(x) {
                        return (500 * Math.pow(1.5, x)) - 400;
                    }
        
                    modifyAllFishPrices(priceEnhanceFunc(target, original));
                    this.cost = costFunc(target);
                    this.level = target;
                    updateShopListing("iceboxes", this);
                },
                cost: 100.0,
                level: 0,
                levelMax: 2000,
            },
            dagon: {
                applyLevel: function(target, original) {
                    function growthFactor(target, original) {
                        if (original > target) return 1.0;
                        let diff = target - original;
                        return 1.05 ** Math.floor(diff);
                    }
                    function costFunc(x) {
                        return 5 ** (x + 4) + 4375;
                    }

                    if (original > target) return;

                    scaleMaxFishWeights(growthFactor(target, original));
                    this.cost = costFunc(target);
                    this.level = target;
                    updateShopListing("dagon", this);
                },
                cost: 5000,
                level: 0,
                levelMax: 200,
            },
            realitywarp: {
                applyLevel: function(target, original) {
                    function gainFunc(t, o, max) {
                        let remainingSteps = max - o;
                        let stepsToTake = t - o;
                        return stepsToTake / remainingSteps;
                    }
                    function costFunc(x) {
                        return (1e4) * (10 ** (2*x));
                    }

                    if (original > target ) return;
                    equalizeRarityLikelyhoods(gainFunc(target, original, this.levelMax));
                    this.cost = costFunc(target);
                    this.level = target;
                    updateShopListing("realitywarp", this);
                },
                cost: 100000,
                level: 0,
                levelMax: 20,
            },
            fishcompression: {
                applyLevel: function(target, original) {
                    function gainFunc(x) {
                        return x + 5;
                    }
                    function costFunc(x) {
                        return (1000 *  (x ** 3) * (51/50 ** x)) + 1000;
                    }

                    if (original > target ) return;
                    gameState.bucket_size += gainFunc(target) - gainFunc(original);
                    updateFishPerSec();
                    this.cost = costFunc(target);
                    this.level = target;
                    updateShopListing("fishcompression", this);
                },
                cost: 1000,
                level: 0,
                levelMax: 95,
            }
        },
        fish_tables: {
            "river": {
                "common": [
                    {
                        "name": "carp",
                        "w_min": 8.0,
                        "w_max": 40.0,
                        "price_per_w": 0.15
                    },
                    {
                        "name": "trout",
                        "w_min": 10.0,
                        "w_max": 42.0,
                        "price_per_w": 0.15
                    },
                    {
                        "name": "guppy",
                        "w_min": 0.5,
                        "w_max": 12.0,
                        "price_per_w": 0.5
                    },
                    {
                        "name": "piranha",
                        "w_min": 0.5,
                        "w_max": 10.0,
                        "price_per_w": 0.61
                    },
                    {
                        "name": "blue discus",
                        "w_min": 0.5,
                        "w_max": 10.0,
                        "price_per_w": 0.62
                    },
                    {
                        "name": "goldfish",
                        "w_min": 0.1,
                        "w_max": 5.0,
                        "price_per_w": 1.9
                    }
                ],
                "uncommon": [
                    {
                        "name": "catfish",
                        "w_min": 8.0,
                        "w_max": 80.0,
                        "price_per_w": 0.18
                    },
                    {
                        "name": "largemouth bass",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 0.3
                    },
                    {
                        "name": "chinook salmon",
                        "w_min": 12.0,
                        "w_max": 35.0,
                        "price_per_w": 0.392
                    },
                    {
                        "name": "butterfly peacock bass",
                        "w_min": 0.5,
                        "w_max": 10.0,
                        "price_per_w": 1.4
                    },
                    {
                        "name": "tambaqui",
                        "w_min": 0.5,
                        "w_max": 10.0,
                        "price_per_w": 1.43
                    }
                ],
                "rare": [
                    {
                        "name": "blugill",
                        "w_min": 1.0,
                        "w_max": 5.0,
                        "price_per_w": 5.0
                    },
                    {
                        "name": "arowana",
                        "w_min": 2.0,
                        "w_max": 14.0,
                        "price_per_w": 2.5
                    },
                    {
                        "name": "king salmon",
                        "w_min": 35.0,
                        "w_max": 50.0,
                        "price_per_w": 0.7
                    },
                    {
                        "name": "banjo catfish",
                        "w_min": 13.0,
                        "w_max": 100.0,
                        "price_per_w": 0.32
                    },
                    {
                        "name": "green terror",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 0.81
                    },
                    {
                        "name": "electric eel",
                        "w_min": 8.0,
                        "w_max": 24.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "sturgeon",
                        "w_min": 45.0,
                        "w_max": 120.0,
                        "price_per_w": 0.31
                    },
                    {
                        "name": "alligator gar",
                        "w_min": 20.0,
                        "w_max": 60.0,
                        "price_per_w": 0.67
                    },
                    {
                        "name": "largermouth bass",
                        "w_min": 35.0,
                        "w_max": 70.0,
                        "price_per_w": 0.3
                    },
                    {
                        "name": "koi",
                        "w_min": 8.0,
                        "w_max": 40.0,
                        "price_per_w": 0.71
                    }
                ],
                "superrare": [
                    {
                        "name": "golden minnow",
                        "w_min": 1.0,
                        "w_max": 5.0,
                        "price_per_w": 20.0
                    },
                    {
                        "name": "alligator",
                        "w_min": 80.0,
                        "w_max": 800.0,
                        "price_per_w": 0.18
                    },
                    {
                        "name": "largestmouth bass",
                        "w_min": 70.0,
                        "w_max": 240.0,
                        "price_per_w": 0.4
                    }
                ],
                "legendary": [
                    {
                        "name": "diamond",
                        "w_min": 1.0,
                        "w_max": 3.0,
                        "price_per_w": 80.0
                    },
                    {
                        "name": "arapaima",
                        "w_min": 80.0,
                        "w_max": 500.0,
                        "price_per_w": 0.71
                    }
                ],
                "absurd": [
                    {
                        "name": "excalibur",
                        "w_min": 2.0,
                        "w_max": 6.0,
                        "price_per_w": 500.0
                    },
                    {
                        "name": "nessie",
                        "w_min": 800.0,
                        "w_max": 1200.0,
                        "price_per_w": 3.1
                    }
                ]
            },
            "prehistoric": {
                "common": [
                    {
                        "name": "cameroceras",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "trilobite",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    }
                ],
                "uncommon": [
                    {
                        "name": "endoceras",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "pentecopterus",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "titanichthys",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "bothrriolepis",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "dracopristis",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "allenypterus",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "rhizodus",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "squatinactis",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "phanerosteon",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "falcatus",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "ornithoprion",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    }
                ],
                "rare": [
                    {
                        "name": "Anomalocaris",
                        "w_min": 0.2,
                        "w_max": 1.5,
                        "price_per_w": 150000.0
                    },
                    {
                        "name": "dunkleosteus",
                        "w_min": 500.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    }
                ],
                "superrare": [
                    {
                        "name": "megalodon",
                        "w_min": 1000.0,
                        "w_max": 2000.0,
                        "price_per_w": 1.0
                    }
                ],
                "legendary": [
                    {
                        "name": "hound of tindalos",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "absurd": [
                    {
                        "name": "troutasaurus rex",
                        "w_min": 35000.0,
                        "w_max": 50000.0,
                        "price_per_w": 4000.0
                    }
                ]
            },
            "ocean": {
                "common": [
                    {
                        "name": "angelfish",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 8.0
                    },
                    {
                        "name": "powder blue tang",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 8.0
                    },
                    {
                        "name": "yellow tang",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 8.0
                    },
                    {
                        "name": "grouper",
                        "w_min": 2.0,
                        "w_max": 50.0,
                        "price_per_w": 1.8
                    },
                    {
                        "name": "clownfish",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 2.0
                    },
                    {
                        "name": "flounder",
                        "w_min": 4.0,
                        "w_max": 10.0,
                        "price_per_w": 2.0
                    },
                    {
                        "name": "oblong goby",
                        "w_min": 0.5,
                        "w_max": 3.0,
                        "price_per_w": 4.0
                    },
                    {
                        "name": "atlantic tarpon",
                        "w_min": 1.2,
                        "w_max": 12.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "bluefin tuna",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 1.0
                    }
                ],
                "uncommon": [
                    {
                        "name": "bi-color parrotfish",
                        "w_min": 2.0,
                        "w_max": 7.0,
                        "price_per_w": 4.0
                    },
                    {
                        "name": "clown triggerfish",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 8.0
                    },
                    {
                        "name": "barracuda",
                        "w_min": 1.0,
                        "w_max": 15.0,
                        "price_per_w": 4.0
                    },
                    {
                        "name": "octopus",
                        "w_min": 1.0,
                        "w_max": 12.0,
                        "price_per_w": 4.0
                    },
                    {
                        "name": "goldeye rockfish",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 2.0
                    },
                    {
                        "name": "harlequin sweetlips",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 4.0
                    },
                    {
                        "name": "pilotfish",
                        "w_min": 0.5,
                        "w_max": 3.0,
                        "price_per_w": 15.0
                    },
                    {
                        "name": "stingray",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 1.218
                    },
                    {
                        "name": "moon jelly",
                        "w_min": 0.2,
                        "w_max": 5.0,
                        "price_per_w": 16.0
                    },
                    {
                        "name": "remora",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 2.0
                    }
                ],
                "rare": [
                    {
                        "name": "manta ray",
                        "w_min": 12.0,
                        "w_max": 80.0,
                        "price_per_w": 4.235
                    },
                    {
                        "name": "warty frogfish",
                        "w_min": 0.5,
                        "w_max": 4.0,
                        "price_per_w": 30.2
                    },
                    {
                        "name": "mahi mahi",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 7.0
                    },
                    {
                        "name": "humphead wrasse",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 7.0
                    },
                    {
                        "name": "giant grouper",
                        "w_min": 35.0,
                        "w_max": 100.0,
                        "price_per_w": 2.52
                    },
                    {
                        "name": "marlin",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 8.0
                    },
                    {
                        "name": "mako shark",
                        "w_min": 120.0,
                        "w_max": 300.0,
                        "price_per_w": 0.713
                    },
                    {
                        "name": "nurse shark",
                        "w_min": 45.0,
                        "w_max": 80.0,
                        "price_per_w": 2.567
                    },
                    {
                        "name": "hammerhead shark",
                        "w_min": 150.0,
                        "w_max": 450.0,
                        "price_per_w": 0.8
                    }
                ],
                "superrare": [
                    {
                        "name": "world's fastest crouton",
                        "w_min": 0.01,
                        "w_max": 0.3,
                        "price_per_w": 10000.0
                    },
                    {
                        "name": "orca",
                        "w_min": 30.0,
                        "w_max": 400.0,
                        "price_per_w": 123.28
                    },
                    {
                        "name": "great white shark",
                        "w_min": 450.0,
                        "w_max": 1100.0,
                        "price_per_w": 1.23109
                    },
                    {
                        "name": "whale shark",
                        "w_min": 1500.0,
                        "w_max": 3000.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "narwhal",
                        "w_min": 300.0,
                        "w_max": 1300.0,
                        "price_per_w": 2.3
                    }
                ],
                "legendary": [
                    {
                        "name": "ceolocanth",
                        "w_min": 8.0,
                        "w_max": 35.0,
                        "price_per_w": 678.0
                    },
                    {
                        "name": "blue whale",
                        "w_min": 100000.0,
                        "w_max": 177808.0,
                        "price_per_w": 0.8
                    },
                    {
                        "name": "giant squid",
                        "w_min": 1800.0,
                        "w_max": 3000.0,
                        "price_per_w": 15.2983
                    },
                    {
                        "name": "oarfish",
                        "w_min": 300.0,
                        "w_max": 500.0,
                        "price_per_w": 18.37
                    }
                ],
                "absurd": [
                    {
                        "name": "USS Nautilus (SS-168)",
                        "w_min": 475000.0,
                        "w_max": 500000.0,
                        "price_per_w": 0.82837
                    },
                    {
                        "name": "kraken",
                        "w_min": 100000.0,
                        "w_max": 500000.0,
                        "price_per_w": 1.238
                    }
                ]
            },
            "galactic": {
                "common": [
                    {
                        "name": "neptunian goby",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "mercurian tuna",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "venusian carp",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "andromedan guppy",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "uncommon": [
                    {
                        "name": "mi-go",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "saturnian salmon",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "rare": [
                    {
                        "name": "nightgaunt",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "byakhee",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "flying polyp",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "hunting horror",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "superrare": [
                    {
                        "name": "shantak",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "legendary": [
                    {
                        "name": "big bitch",
                        "w_min": 1.0,
                        "w_max": 1000.0,
                        "price_per_w": 1.0
                    }
                ],
                "absurd": [
                    {
                        "name": "azathoth",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "nyarlathotep",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ]
            },
            "abyss": {
                "common": [
                    {
                        "name": "anglerfish",
                        "w_min": 1.0,
                        "w_max": 15.0,
                        "price_per_w": 6.0
                    },
                    {
                        "name": "hagfish",
                        "w_min": 1.0,
                        "w_max": 20.0,
                        "price_per_w": 5.6
                    },
                    {
                        "name": "sea cucumber",
                        "w_min": 0.5,
                        "w_max": 8.0,
                        "price_per_w": 12.48
                    },
                    {
                        "name": "snailfish",
                        "w_min": 0.1,
                        "w_max": 0.8,
                        "price_per_w": 118.0
                    },
                    {
                        "name": "fangtooth",
                        "w_min": 0.2,
                        "w_max": 1.2,
                        "price_per_w": 75.0
                    },
                    {
                        "name": "viperfish",
                        "w_min": 0.5,
                        "w_max": 3.0,
                        "price_per_w": 30.0
                    },
                    {
                        "name": "longnose chimaera",
                        "w_min": 8.0,
                        "w_max": 18.0,
                        "price_per_w": 4.2
                    }
                ],
                "uncommon": [
                    {
                        "name": "goblin shark",
                        "w_min": 60.0,
                        "w_max": 100.0,
                        "price_per_w": 1.3
                    },
                    {
                        "name": "giant isopod",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 2.0
                    },
                    {
                        "name": "barrel eye",
                        "w_min": 0.8,
                        "w_max": 8.0,
                        "price_per_w": 25.0
                    },
                    {
                        "name": "cusk eel",
                        "w_min": 3.0,
                        "w_max": 14.0,
                        "price_per_w": 12.0
                    },
                    {
                        "name": "rattail",
                        "w_min": 1.0,
                        "w_max": 14.0,
                        "price_per_w": 14.0
                    },
                    {
                        "name": "helmet jelly",
                        "w_min": 0.1,
                        "w_max": 3.0,
                        "price_per_w": 70.0
                    },
                    {
                        "name": "swarthy snaketooth",
                        "w_min": 4.0,
                        "w_max": 12.0,
                        "price_per_w": 13.0
                    },
                    {
                        "name": "sea angel",
                        "w_min": 0.1,
                        "w_max": 2.0,
                        "price_per_w": 100.0
                    }
                ],
                "rare": [
                    {
                        "name": "vampire squid",
                        "w_min": 1.0,
                        "w_max": 7.0,
                        "price_per_w": 800.0
                    },
                    {
                        "name": "whale carcass",
                        "w_min": 800.0,
                        "w_max": 1500.0,
                        "price_per_w": 3.0
                    },
                    {
                        "name": "pelican eel",
                        "w_min": 4.0,
                        "w_max": 12.0,
                        "price_per_w": 390.0
                    },
                    {
                        "name": "strawberry squid",
                        "w_min": 1.0,
                        "w_max": 7.0,
                        "price_per_w": 818.0
                    },
                    {
                        "name": "blobfish",
                        "w_min": 0.5,
                        "w_max": 6.0,
                        "price_per_w": 925.0
                    }
                ],
                "superrare": [
                    {
                        "name": "dumbo octopus",
                        "w_min": 0.2,
                        "w_max": 3.0,
                        "price_per_w": 19023.0
                    },
                    {
                        "name": "greenland shark",
                        "w_min": 500.0,
                        "w_max": 1000.0,
                        "price_per_w": 40.21
                    },
                    {
                        "name": "deep one",
                        "w_min": 60.0,
                        "w_max": 140.0,
                        "price_per_w": 302.3
                    }
                ],
                "legendary": [
                    {
                        "name": "starspawn",
                        "w_min": 4300.0,
                        "w_max": 8000.0,
                        "price_per_w": 30.3
                    },
                    {
                        "name": "shoggoth",
                        "w_min": 3000.0,
                        "w_max": 8000.0,
                        "price_per_w": 12.6
                    }
                ],
                "absurd": [
                    {
                        "name": "cthulhu",
                        "w_min": 100000.0,
                        "w_max": 1000000.0,
                        "price_per_w": 10.0
                    }
                ]
            },
            "galactic ": {
                "common": [
                    {
                        "name": "megelanic loach",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "uncommon": [
                    {
                        "name": "pisces",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "cancer",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "capricorn",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    },
                    {
                        "name": "hydralisk",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "rare": [
                    {
                        "name": "bootes whale",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "superrare": [
                    {
                        "name": "sandworm",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "legendary": [
                    {
                        "name": "hellstar remina",
                        "w_min": 1.0,
                        "w_max": 100.0,
                        "price_per_w": 1.0
                    }
                ],
                "absurd": []
            }
        }
    };
    state.current_rod = state.inventory[0];
    return state;
}

function initStats() {
    let result = {};

    for (const location in gameState.fish_tables) {
        let locationTable = gameState.fish_tables[location];
        for (const rarity in locationTable) {
            let rarityTable = locationTable[rarity];
            for (let i = 0; i < rarityTable.length; i++) {
                let fishDefinition = rarityTable[i];
                result[fishDefinition.name] = {
                    caught: 0,
                    largest: null,
                    rarity: rarity,
                    location: location,
                };
            }
        }
    }

    return result;
}


//////////////// --        END SECTION        -- ////////////////
//////////////// --    SECTION: Game Logic    -- ////////////////

// Setup
document.addEventListener("DOMContentLoaded", gameInit);
const storageSaveKey = "GilderBeanFishingIdleGameSave";
let gameState = initialState();
gameState.stats = initStats();

function gameInit() {
    // try to load previous game save
    let loadedState = undefined;
    let loadedStateSerial = localStorage.getItem(storageSaveKey);
    try {
        loadedState = JSON.parse(loadedStateSerial);
        if (loadedState) {
            addFunds(loadedState.funds);
            gameState.tot_fish = loadedState.tot_fish;
            updateFishCounter();

            //inventory
            if (loadedState.current_rod) {
                gameState.current_rod = loadedState.current_rod;
                updateCurrentRod();
            }
            for (let i = 0; i < loadedState.inventory.length; i++) {
                let loadedRod = loadedState.inventory[i];
                let foundRod = gameState.inventory.find((rod) => rod.name === loadedRod.name)
                if (foundRod) {
                    foundRod.state = loadedRod.state;
                }
            }
            updateRodShop();

            // upgrades
            for (let key in loadedState.upgrades) {
                let matchingUpgr = gameState.upgrades[key];
                let loadedUpgr = loadedState.upgrades[key];
                if (matchingUpgr && loadedUpgr) {
                    // clamp to 0 <= lvl <= levelMax
                    let lvl = Math.min(loadedUpgr.level, matchingUpgr.levelMax);
                    lvl = Math.max(lvl, 0);
                    matchingUpgr.applyLevel(lvl, 0);
                }
            }

            // load previous stats
            for (let key in loadedState.stats) {
                let loadedStat = loadedState.stats[key];
                let matchingStat = gameState.stats[key];

                if (loadedStat && matchingStat) {
                    matchingStat.caught = loadedStat.caught;
                    matchingStat.largest = loadedStat.largest;
                }
            }
        }
    } catch(error) {
        console.warn("error occured loading state");
    }

    updateRodShop();
    writeFullStatsToDOM();
}

function writeFullStatsToDOM() {
    let tableBody = document.getElementById("stats-body");

    for (const fishName in gameState.stats) {
        let stat = gameState.stats[fishName];

        let newRow = document.createElement("tr");
        newRow.id = `${fishName}-stat`;
        newRow.innerHTML += `<td><span class="${stat.rarity}">${fishName}</span></td>`;
        newRow.innerHTML += `<td><span class="${stat.location}">${stat.location}</span></td>`;
        newRow.innerHTML += `<td>${stat.rarity}</td>`;
        newRow.innerHTML += `<td>${stat.caught}</td>`;
        newRow.innerHTML += `<td><span class="weight">${formatWeightText(stat.largest)} kg</span></td>`;

        if (stat.caught === 0) {
            newRow.style.display = "none";
        }

        tableBody.appendChild(newRow);
    }
}

// passive fish accumulation
const autoFishPeriod = 500;
let autoFishProgress = 0;
let autoFishInterval = setInterval(autoFish, autoFishPeriod)

function autoFish() {
    autoFishProgress += gameState.buckets_per_sec * (autoFishPeriod/1000);
    //console.log(autoFishProgress);
    let completedBuckets = Math.floor(autoFishProgress);
    for(let i = 0; i < completedBuckets; i++) {
        catchFishBucket();
    }
    autoFishProgress -= completedBuckets;
}


// generate a random fish from the given location
function generateFish() {
    let table = gameState.current_rod.location;
    let rarity_roll = Math.random();
    let rare_table = gameState.rarity_drop_rate;
    let rarity = undefined;
    // determine rarity
    let i = 0;
    while(!rarity) {
        if (rarity_roll <= rare_table[i].thresh || i === rare_table.length - 1) {
            rarity = rare_table[i].rarity;
        }
        i++;
    }
    // pick fish species
    let fish_list = gameState.fish_tables[table][rarity]
    let fish_params = fish_list[Math.floor(Math.random() * fish_list.length)]
    // pick random weight
    let w_range = fish_params.w_max - fish_params.w_min
    let weight = fish_params.w_min + (Math.random() * w_range)
    // return fish
    return {
        name: fish_params.name,
        weight: weight,
        price: weight * fish_params.price_per_w,
        rarity: rarity,
    };
}


// Number formatting utilities
const letter_suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'D', 'UD', 'DD', 'TD', 'QaD', 'QiD', 'SxD', 'SpD', 'OD', 'ND', 'V'];
const sci_suffixes = ['', 'e3', 'e6', 'e9', 'e12', 'e15', 'e16', 'e19', 'e21', 'e24', 'e27', 'e30', 'e33', 'e36', 'e39', 'e42', 'e45', 'e48', 'e51', 'e54', 'e57'];
let suffixes = letter_suffixes;

function formatPriceText(number) {
    return `$ ${numberToText(number, 2)}`;
}
function formatWeightText(number) {
    if (number == null) {
        return "--";
    }
    const number_format = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return number.toLocaleString(undefined, number_format);
}
function formatFishPerSecNumber(number) {
    if (number === 0 || number == null)  {
        return "--";
    }
    const number_format = { minimumFractionDigits: 3, maximumFractionDigits: 3 };
    return number.toLocaleString(undefined, number_format);
}
function numberToText(number, decimals) {
    const number_format = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
    if (number < 10_000) {
        return number.toLocaleString(undefined, number_format);
    }
    
    let groups_of_3 = Math.floor(Math.log10(number) / 3);

    // protect for overflow of available text suffixes
    if (groups_of_3 >= suffixes.length) {
        groups_of_3 = suffixes.length - 1
    }

    number = number / Math.pow(10, (groups_of_3) * 3);
    let suffix = suffixes[groups_of_3];
    return number.toLocaleString(undefined, number_format) + suffix;
}


// bookkeeping functions
const max_log_entries = 60;

function addFishNotif(fish) {
    let log = document.createElement("div");
    log.className = `fish-log-entry`;
    log.innerHTML = 
        `Caught a <span class="${fish.rarity}">${fish.name}</span>!` +
        ` w: <span class="weight">${formatWeightText(fish.weight)}kg</span>` +
        ` price: <span class="price">${formatPriceText(fish.price)}</span>`;
    
    addLogChild(log);
}

function addBucketNotif(bucketFish) {
    let log = document.createElement("details");
    let summary = document.createElement("summary");
    log.appendChild(summary);
    log.className = `bucket-log-entry`;
    
    let priceSum = bucketFish.reduce((total, fish) => total + fish.price, 0);
    summary.innerHTML = `Reeled in a bucket of ${bucketFish.length} fish worth <span class="price">${formatPriceText(priceSum)}</span>`;

    //console.log(bucketFish);
    let mergedBucketFish = mergeDuplicateFish(bucketFish);
    sortFishListByRarity(mergedBucketFish);
    //console.log(mergedBucketFish);
    
    for (let i = 0; i < mergedBucketFish.length; i++) {
        let fish = mergedBucketFish[i];
        log.innerHTML += 
        `<p class="fish-log-entry">${fish.count}x <span class="${fish.rarity}">${fish.name}</span>!` +
        ` total w: <span class="weight">${formatWeightText(fish.weight)}kg</span>` +
        ` total price: <span class="price">${formatPriceText(fish.price)}</span></p>`;
    }
    
    addLogChild(log);
}

function addLogChild(log) {
    let logParent = document.getElementById("fish-log");
    let shouldScrollToLog = logParent.scrollTop === logParent.scrollTopMax;

    if (logParent.children.length === max_log_entries) {
        let oldestLog = logParent.firstChild;
        logParent.removeChild(oldestLog);
    }
    logParent.appendChild(log);

    if (shouldScrollToLog) {
        logParent.scrollTop = logParent.scrollTopMax;
    }
}

function addFunds(amount) {
    gameState.funds += amount;
    let displayText = formatPriceText(gameState.funds)
    let uiElement = document.getElementById("funds-text");
    uiElement.innerText = displayText;
}

function updateFishCounter() {
    let decimals = 0;
    if (gameState.tot_fish > 10_000) {
        decimals = 2
    }
    let displayText = numberToText(gameState.tot_fish, decimals);
    let uiElement = document.getElementById("fish-caught");
    uiElement.innerText = displayText;
}


// Stat tracking

function recordFishStats(fish) {
    let existingRecord = gameState.stats[fish.name];

    if (!existingRecord) {
        let newRecord = {
            rarity: fish.rarity,
            location: gameState.current_rod.location, // I hope this is reliable enough to use. alternatively this could search the fish tables. could also cause a problem if fish move locations but i doubt that will happen
            caught: 1,
            largest: fish.weight,
        };
        gameState.stats[fish.name] = newRecord;
    } else {
        existingRecord.caught++;
        existingRecord.largest = Math.max(fish.weight, existingRecord.largest);
    }
    
    // TODO: update dom element
    updateStatRow(fish.name);
}

function updateStatRow(fishName) {
    let tableRow = document.getElementById(`${fishName}-stat`);
    let relevantStat = gameState.stats[fishName];

    const tableColumns = {
        caught: 3,
        largest: 4,
    }

    //console.log(tableRow);

    tableRow.children[tableColumns.caught].innerText = relevantStat.caught;
    let largestWeightTD = tableRow.children[tableColumns.largest];
    let weightSpan = largestWeightTD.children[0]
    weightSpan.innerText = `${formatWeightText(relevantStat.largest)} kg`;

    if (relevantStat.caught === 0) {
        tableRow.style.display = "none";
    } else {
        tableRow.style.display = "table-row";
    }
}

// Player clicks the manual fishing button
function fishClick() {
    catchFish();
    createFishParticle();
}

function catchFish() {
    let caughtFish = generateFish();
    addFishNotif(caughtFish);
    recordFishStats(caughtFish);
    addFunds(caughtFish.price);
    gameState.tot_fish++;
    updateFishCounter();
}

function catchFishBucket() {
    let bucket_fish = [];
    let totalBucketValue = 0;
    for (let i = 0; i < gameState.bucket_size; i++) {
        let fish = generateFish()
        bucket_fish.push(fish);
        totalBucketValue += fish.price;
        recordFishStats(fish);
    }
    addBucketNotif(bucket_fish);
    addFunds(totalBucketValue);
    gameState.tot_fish += bucket_fish.length;
    updateFishCounter();
}

function createFishParticle() {
    let particle = document.createElement("span");
    let num_anims = 4;
    let fishBtnBounds = document.getElementsByClassName("FISH")[0].getBoundingClientRect();
    particle.innerText = "🐟";
    particle.className = "fish-particle";
    particle.style.animationName = `fish-particle-anim-${Math.floor(Math.random() * num_anims) + 1}`
    particle.style.top = `${fishBtnBounds.top}px`;
    particle.style.left = `${(fishBtnBounds.left + fishBtnBounds.right) / 2}px`;
    document.body.append(particle);
    //console.log(particle);
    setTimeout(() => delFishParticle(particle), 500)
    function delFishParticle(element) {
        document.body.removeChild(element);
    }
}


// Upgrade shop related functions
function improveUpgrade(name) {
    let upgr = gameState.upgrades[name];
    if (gameState.funds < upgr.cost) {
        return;
    }
    if (upgr.level >= upgr.levelMax) {
        return;
    }

    addFunds(-1 * upgr.cost);
    upgr.applyLevel(upgr.level + 1, upgr.level);
    //console.log(upgr);
}

function updateShopListing(id, upgradeInfo) {
    var shopEl = document.getElementById(id);
    //console.log(shopEl);
    shopEl.getElementsByClassName("cur-upgr-lvl")[0].innerText = Math.floor(upgradeInfo.level);
    let newCostText = '';
    let buttonEl = shopEl.getElementsByClassName("upgr-lvlup")[0];
    if (upgradeInfo.level < upgradeInfo.levelMax) {
        newCostText = `Lvl Up (${formatPriceText(upgradeInfo.cost)})`;
    } else {
        newCostText = "Max Lvl reached";
        buttonEl.disabled = true;
    }
    buttonEl.innerText = newCostText;
}

function modifyFishPerSec(amount) {
    gameState.buckets_per_sec += amount;
    updateFishPerSec();
}

function updateFishPerSec() {
    let displayText = "";
    if (gameState.buckets_per_sec == 0) {
        displayText = formatFishPerSecNumber(0);
    } else {
        displayText = formatFishPerSecNumber(1 / gameState.buckets_per_sec)
    }
    let uiElement = document.getElementById("bucket-persec");
    uiElement.innerText = displayText;

    let bucketCountElement = document.getElementById("bucket-size");
    bucketCountElement.innerText = gameState.bucket_size;
}

function modifyAllFishPrices(factor) {
    applyFuncPerFish((fish) => {
        fish.price_per_w = fish.price_per_w * factor;
    });
}

function equalizeRarityLikelyhoods(factor) {
    let rarities = gameState.rarity_drop_rate;
    //console.log(factor);
    for (let i = 0; i < rarities.length; i++) {
        let rarityLevel = rarities[i];
        let ultimateThresh = (1 / rarities.length) * (i + 1);
        let diff = ultimateThresh - rarityLevel.thresh;
        //console.log(`[${rarityLevel.rarity}] current: ${rarityLevel.thresh}, ultimate: ${ultimateThresh}, diff: ${diff}, movement: ${diff * factor}, result: ${rarityLevel.thresh + (diff * factor)}`);
        rarityLevel.thresh += diff * factor;
    }
}

function scaleMaxFishWeights(factor) {
    applyFuncPerFish((fish) => {
        let w_range = fish.w_max - fish.w_min;
        fish.w_max = fish.w_min + (w_range * factor);
    });
}

function applyFuncPerFish(func) {
    for (let key in gameState.fish_tables) {
        for (let rarity in gameState.fish_tables[key]) {
            let fishes = gameState.fish_tables[key][rarity];
            for (let i = 0; i < fishes.length; i++) {
                func(fishes[i]);
            }
        }
    }
}


//rod shop functions
function purchaseRod(name) {
    let foundRod = gameState.inventory.find((rod) => rod.name === name);
    if (foundRod == null) {
        return;
    }
    if (gameState.funds < foundRod.price) {
        return;
    }

    addFunds(-1 * foundRod.price);
    equipRod(foundRod);
}

function equipRod(rod) {
    // try to use the rod items in the inventory
    let prevEquip = gameState.inventory.find((invrod) => invrod.name === gameState.current_rod.name);
    let newEquip = gameState.inventory.find((invrod) => invrod.name === rod.name);
    
    //defaults just in case;
    if (newEquip == null) {
        newEquip = rod;
    }
    if (prevEquip == null) {
        prevEquip = gameState.current_rod;
    }

    newEquip.state = "equipped";
    prevEquip.state = "available";
    gameState.current_rod = newEquip;
    updateCurrentRod();
    updateRodShop();
}

function updateCurrentRod() {
    let equipElement = document.getElementById("current-equip");
    equipElement.getElementsByClassName("equip-name")[0].innerText = gameState.current_rod.name;
}

function updateRodShop() {
    for (let i = 0; i < gameState.inventory.length; i++) {
        let rod = gameState.inventory[i];
        let buttonText = "";
        let buttonClass = "green-btn"
        let disableButton = "";
        let rodID = "rod-" + rod.name.replaceAll(" ", "-");
        if (rod.state === "unpurchased") {
            buttonText = `Purchase (${formatPriceText(rod.price)})`;
            buttonClass = "blue-btn";
        }
        if (rod.state === "available") {
            buttonText = "equip";
        }
        if (rod.state === "equipped") {
            buttonText = "equipped";
            disableButton = "disabled='true'";
        }

        let storeElementHTML = `<div class="inventory-item column-group" id="${rodID}">
            <div class="column">
                <span class="equip-name">${rod.name}</span>
                <span class="equip-descrip">${rod.description}</span>
            </div>
            <div class="column">
                <button ${disableButton} class="${buttonClass}">${buttonText}</button>
            </div>
        </div>`;

        let rodListing = document.getElementById(rodID);
        rodListing.outerHTML = storeElementHTML;
        if (rod.state === "unpurchased") {
            // refresh element and add click listener
            rodListing = document.getElementById(rodID);
            rodListing.getElementsByTagName("button")[0].onclick = () => {purchaseRod(rod.name);};
        }
        if (rod.state === "available") {
            rodListing = document.getElementById(rodID);
            rodListing.getElementsByTagName("button")[0].onclick = () => {equipRod(rod);};
        }
    }
    
}


// helper functions
function sortFishListByRarity(fishList) {
    let rarityOrder = gameState.rarity_drop_rate.map((item) => item.rarity);

    fishList.sort((fish1, fish2) => {
        // reversed order so that higher rarity fish appear first
        return rarityOrder.indexOf(fish1.rarity) < rarityOrder.indexOf(fish2.rarity)
    });
}

function mergeDuplicateFish(fishList) {
    let fishDictionary = {}
    for (let i = 0; i < fishList.length; i++) {
        let currentFish = fishList[i];
        if (fishDictionary[currentFish.name]) {
            fishDictionary[currentFish.name].push(currentFish);
        } else {
            fishDictionary[currentFish.name] = [ currentFish ];
        }
    }

    let result = [];
    for (const fishName in fishDictionary) {
        let sameSpeciesFish = fishDictionary[fishName];
        result.push({
            name: fishName,
            rarity: sameSpeciesFish[0].rarity,
            weight: sameSpeciesFish.reduce((acc, item) => acc + item.weight, 0),
            price: sameSpeciesFish.reduce((acc, item) => acc + item.price, 0),
            count: sameSpeciesFish.length,
        });
    }
    return result;
}


// Save game button
function saveGame() {
    localStorage.setItem(storageSaveKey, JSON.stringify(gameState));
}

function resetGame() {
    let resetAnswer = confirm("Are you sure you want to reset the game?" +
        "\nAll progress will be lost permanently if you delete your save or save again after resetting." +
        "\n\nDo you wish to reset?");
    
    if (!resetAnswer) return;

    gameState = initialState();
    gameState.stats = initStats();

    //clear stats
    let statsBody = document.getElementById("stats-body");
    while (statsBody.firstChild) {
        statsBody.removeChild(statsBody.firstChild);
    }

    writeFullStatsToDOM();
    updateRodShop();
    updateFishCounter();
    for (const key in gameState.upgrades) {
        let currentUpgrade = gameState.upgrades[key];
        console.log(currentUpgrade);
        currentUpgrade.applyLevel(currentUpgrade.level, 0);
    }
    addFunds(0);
    updateCurrentRod();
    modifyFishPerSec(0);
}
