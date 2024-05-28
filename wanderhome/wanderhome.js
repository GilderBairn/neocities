// -------------------- Data -------------------- //
const natures = {
    "Comfortable": ["Farm", "Garden", "Market", "Monastery", "Tower", "Workshop"],
    "Verdant": ["Field", "Glen", "Hallow", "Hillock", "Lagoon", "Swamp"],
    "Liminal": ["Bridge", "Island", "Lake", "Port", "Road", "Tavern"],
};
const rare_natures = {
    "Sprawling": ["Carnival", "Castle", "Furnace", "Metropolis", "Palace", "University"],
    "Lonely": ["Cave", "Graveyard", "Mirage", "Mirror", "Moor", "Wilderness"],
    "Desolate": ["Desert", "Labyrinth", "Maelstrom", "Mountain", "Ruin", "Waste"],
};
const months = [
    { season: "Leap",    name: "Tillsoil"    },
    { season: "Leap",    name: "Monsoon"     },
    { season: "Brigth",  name: "Bloommeadow" },
    { season: "Bright",  name: "Devildays"   },
    { season: "Breathe", name: "Swarming"    },
    { season: "Breathe", name: "Gateling"    },
    { season: "Silt",    name: "Firetop"     },
    { season: "Silt",    name: "Grasping"    },
    { season: "Chill",   name: "Snowblanket" },
    { season: "Chill",   name: "Frostbite"   },
]
const traits = [ // Kinds: R=Regular, M=Magical, T=Traumatised
  { category: "Artistic",     desc: "Crafty",      Kind: "R" },
  { category: "Artistic",     desc: "Dramatic",    Kind: "R" },
  { category: "Artistic",     desc: "Imaginative", Kind: "R" },
  { category: "Artistic",     desc: "Poetic",      Kind: "R" },
  { category: "Artistic",     desc: "Glamorous",   Kind: "M" },
  { category: "Artistic",     desc: "Miraculous",  Kind: "M" },
  { category: "Grounded",     desc: "Honest",      Kind: "R" },
  { category: "Grounded",     desc: "Quiet",       Kind: "R" },
  { category: "Grounded",     desc: "Watchful",    Kind: "R" },
  { category: "Grounded",     desc: "Wise",        Kind: "R" },
  { category: "Grounded",     desc: "Intertwined", Kind: "M" },
  { category: "Grounded",     desc: "Invisible",   Kind: "M" },
  { category: "Intellectual", desc: "Ambitious",   Kind: "R" },
  { category: "Intellectual", desc: "Cunning",     Kind: "R" },
  { category: "Intellectual", desc: "Inquisitive", Kind: "R" },
  { category: "Intellectual", desc: "Learned",     Kind: "R" },
  { category: "Intellectual", desc: "Oracular",    Kind: "M" },
  { category: "Intellectual", desc: "Witchy",      Kind: "M" },
  { category: "Personal",     desc: "Cheerful",    Kind: "R" },
  { category: "Personal",     desc: "Confident",   Kind: "R" },
  { category: "Personal",     desc: "Pensive",     Kind: "R" },
  { category: "Personal",     desc: "Relaxed",     Kind: "R" },
  { category: "Personal",     desc: "Luminescent", Kind: "M" },
  { category: "Personal",     desc: "Venerable",   Kind: "M" },
  { category: "Physical",     desc: "Adventurous", Kind: "R" },
  { category: "Physical",     desc: "Passionate",  Kind: "R" },
  { category: "Physical",     desc: "Resolute",    Kind: "R" },
  { category: "Physical",     desc: "Sturdy",      Kind: "R" },
  { category: "Physical",     desc: "Feral",       Kind: "M" },
  { category: "Physical",     desc: "Mighty",      Kind: "M" },
  { category: "Social",       desc: "Caring",      Kind: "R" },
  { category: "Social",       desc: "Friendly",    Kind: "R" },
  { category: "Social",       desc: "Proper",      Kind: "R" },
  { category: "Social",       desc: "Raucous",     Kind: "R" },
  { category: "Social",       desc: "Empathetic",  Kind: "M" },
  { category: "Social",       desc: "Many-Faced",  Kind: "M" },
  { category: "Traumatized",  desc: "Cautious",    Kind: "T" },
  { category: "Traumatized",  desc: "Empty",       Kind: "T" },
  { category: "Traumatized",  desc: "Frantic",     Kind: "T" },
  { category: "Traumatized",  desc: "Furious",     Kind: "T" },
  { category: "Traumatized",  desc: "Greiving",    Kind: "T" },
  { category: "Traumatized",  desc: "Hurt",        Kind: "T" },
  { category: "Traumatized",  desc: "Lost",        Kind: "T" },
  { category: "Traumatized",  desc: "Nervous",     Kind: "T" },
  { category: "Traumatized",  desc: "Starving",    Kind: "T" },
  { category: "Traumatized",  desc: "Heroic",      Kind: "T" },
  { category: "Traumatized",  desc: "Royal",       Kind: "T" },
  { category: "Traumatized",  desc: "Dead",        Kind: "T" },
];
// -------------------- Code -------------------- //

function generate_calendar(months, start_month, magic, traumatized) {
    result = [];
    for (let i = 0; i < months; i++) {
        let current_month = months[(start_month + i) % months.length];
        let year = "" + Marth.floor((start_month + i) / months.length);
        if (!result[year]) {
            result[year] = {};
        }
        if (!result[year][current_month.season]) {
            result[year][current_month.season] = {};
        }
        result[year][current_month.season][current_month.name] = generate_place(magic, traumatized);
    }
    return result;
}

function generate_place(include_magic, include_trauma) {
    let place = {
        natures: generate_natures(),
        kith: [],
    };
    for (let i = 0; i < 5; i++) {
        kith.push(generate_kith());
    }
    return place;
}

function generate_natures() {
    let result = []
    let includes_rare_nature = Math.floor(Math.random() * 5) == 4; // 1 in 5 chance (0-4 range)
    if (includes_rare_nature) {
        result.push(pick_random_nature(result, true))
    }
}

function pick_random_nature(existing, is_rare=false) {
    let target = natures;
    if (is_rare) {
        target = rare_natures;
    }

    target
}

function generate_kith(include_magic, include_trauma) {
    let kith = {};
    kith.name = "[PLACEHOLDER_NAME]";
}
