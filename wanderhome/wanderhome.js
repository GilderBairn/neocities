// -------------------- Data -------------------- //
const natures = [
    { category: "Comfortable", desc: "Farm" },
    { category: "Comfortable", desc: "Garden" },
    { category: "Comfortable", desc: "Market" },
    { category: "Comfortable", desc: "Monastery" },
    { category: "Comfortable", desc: "Tower" },
    { category: "Comfortable", desc: "Workshop" },
    { category: "Verdant",     desc: "Field" },
    { category: "Verdant",     desc: "Glen" },
    { category: "Verdant",     desc: "Hallow" },
    { category: "Verdant",     desc: "Hillock" },
    { category: "Verdant",     desc: "Lagoon" },
    { category: "Verdant",     desc: "Swamp" },
    { category: "Liminal",     desc: "Bridge" },
    { category: "Liminal",     desc: "Island" },
    { category: "Liminal",     desc: "Lake" },
    { category: "Liminal",     desc: "Port" },
    { category: "Liminal",     desc: "Road" },
    { category: "Liminal",     desc: "Tavern" },
];
const rare_natures = [
    { category: "Sprawling", desc: "Carnival" },
    { category: "Sprawling", desc: "Castle" },
    { category: "Sprawling", desc: "Furnace" },
    { category: "Sprawling", desc: "Metropolis" },
    { category: "Sprawling", desc: "Palace" },
    { category: "Sprawling", desc: "University" },
    { category: "Lonely",    desc: "Cave" },
    { category: "Lonely",    desc: "Graveyard" },
    { category: "Lonely",    desc: "Mirage" },
    { category: "Lonely",    desc: "Mirror" },
    { category: "Lonely",    desc: "Moor" },
    { category: "Lonely",    desc: "Wilderness" },
    { category: "Desolate",  desc: "Desert" },
    { category: "Desolate",  desc: "Labyrinth" },
    { category: "Desolate",  desc: "Maelstrom" },
    { category: "Desolate",  desc: "Mountain" },
    { category: "Desolate",  desc: "Ruin" },
    { category: "Desolate",  desc: "Waste" },
];
const months = [
    { season: "Leap",    name: "Tillsoil"    },
    { season: "Leap",    name: "Monsoon"     },
    { season: "Bright",  name: "Bloommeadow" },
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

function random_choice(collection) {
    return collection[Math.floor(Math.random() * collection.length)]
}

/**
 * 
 * @param {number} month_count 
 * @param {number} start_month 
 * @param {boolean} magic 
 * @param {boolean} traumatized 
 * @returns 
 */
function generate_calendar(month_count, start_month, magic, traumatized) {
    result = [];
    for (let i = 0; i < month_count; i++) {
        let current_month = months[(start_month + i) % months.length];
        let year = Math.floor((start_month + i) / months.length);
        if (!result[year]) {
            result.push({});
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
        place.kith.push(generate_kith(include_magic, include_trauma));
    }
    return place;
}

function generate_natures() {
    let result = [];
    let includes_rare_nature = Math.floor(Math.random() * 5) == 4; // 1 in 5 chance (0-4 range)
    if (includes_rare_nature) {
        result.push(pick_random_nature(result, true));
    }

    while (result.length < 3) {
        result.push(pick_random_nature(result));
    }

    return result;
}

function pick_random_nature(existing, is_rare=false) {
    let target = natures;
    if (is_rare) {
        target = rare_natures;
    }

    let valid_choices = target.filter((v) => !(v in existing));
    return random_choice(valid_choices);
}

function generate_kith(include_magic, include_trauma) {
    let kith = {};
    kith.name = "[PLACEHOLDER_NAME]";
    kith.species = "UNK";
    kith.traits = [];
    // each kith gets two traits
    kith.traits.push(pick_random_trait(kith.traits, include_magic, include_trauma));
    kith.traits.push(pick_random_trait(kith.traits, include_magic, include_trauma));
    return kith;
}

function pick_random_trait(existing, include_magic, include_trauma) {
    let choices = traits.filter((v) => !(v in existing));

    if (!include_magic) {
        choices = choices.filter((v) => v.Kind != "M");
    }

    if (!include_trauma) {
        choices = choices.filter((v) => v.Kind != "T");
    }

    return random_choice(choices);
}

function get_calendar_dom(calendar) {
    let root = document.createElement('div');

    calendar.forEach((year, year_num) => {
        let year_summary = document.createElement('summary');
        year_summary.innerText = `Year ${year_num + 1}`;

        let year_details = document.createElement('details');
        year_details.appendChild(year_summary);
        root.appendChild(year_details);

        for(let season in year) {
            let season_dom = get_season_dom(year[season], season);
            year_details.append(season_dom);
        }
    });
    return root;
}

function get_season_dom(season, season_name) {
    let season_summary = document.createElement('summary');
    season_summary.innerText = season_name;

    let season_details = document.createElement('details');
    season_details.appendChild(season_summary);

    for(let month in season) {
        let month_dom = get_month_dom(season[month], month);
        season_details.appendChild(month_dom);
    }

    return season_details;
}

function get_month_dom(month, month_name) {
    let month_summary = document.createElement('summary');
    month_summary.innerText = month_name;

    let month_details = document.createElement('details');
    month_details.appendChild(month_summary);

    let natures = get_natures_dom(month.natures);
    month_details.appendChild(natures);

    let kith = get_kith_dom(month.kith);
    month_details.append(kith);

    return month_details;
}

function get_natures_dom(natures) {
    let natures_div = document.createElement('div');
    natures_div.className = 'natures';

    for(let nature of natures) {
        const nature_desc = document.createElement('h4');
        nature_desc.innerHTML = `${nature.desc} <span class="season">(${nature.category})</span>`;
        natures_div.appendChild(nature_desc)
    }

    return natures_div;
}

function get_kith_dom(kith) {
    let kith_root = document.createElement('div');
    kith_root.className = 'kith-root';

    for(let npc of kith) {
        kith_root.appendChild(get_npc_dom(npc));
    }

    return kith_root;
}

function get_npc_dom(npc) {
    let npc_root = document.createElement('div');
    npc_root.className = 'kith';

    let name_elt = document.createElement('h4');
    name_elt.className = 'name';
    name_elt.innerText = npc.name;
    npc_root.appendChild(name_elt);

    //let spacer = document.createElement('div');
    //spacer.className = 'spacer';
    //npc_root.appendChild(spacer);

    let species_elt = document.createElement('h5');
    species_elt.className = 'species';
    species_elt.innerText = npc.species;
    npc_root.appendChild(species_elt);
    
    for(let trait of npc.traits) {
        let trait_elt = document.createElement('p');
        trait_elt.className = 'trait';
        trait_elt.innerHTML = `${trait.desc} <span class="category">${trait.category}</span>`;

        npc_root.appendChild(trait_elt);
    }

    return npc_root;
}
