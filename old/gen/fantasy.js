grammar_rules = {
    "::R::": ["::Race::", "::Race::", "::Race::", "::Race::", "Half-::Race:: Half-::Race::"],
    "::Race::": ["::Hominid::", "::Goblinoid::", "::Animalkin::", "::Plantkin::", "::Aquarian::", "::Objectkin::", "::Mythkin::"],
    "::Hominid::": ["Human", "Dwarf", "Elf", "Halfling", "Orc"],
    "::Goblinoid::": ["Goblin", "Bugbear", "Kobold"],
    "::Animalkin::": ["::Mamalkin::", "::Aviankin::", "::Reptilekin::", "::Amphibiankin::"],
    "::Mamalkin::": ["Gnoll", "Rat::Gender::", "Otter::Gender::", "Cat::Gender::", "Badger::Gender::", "Loxodon", "Rhinox", "Hippomagnon", "Leonin", "Tigrid", "Mouse::Gender::"],
    "::Plantkin::": ["Applin", "Shroomite", "Fungaloid", "Vineborn"],
    "::Aquarian::": ["Carcinian", "Prawn", "Shark::Gender::"],
    "::Objectkin::": ["Refrigerator"], 
    "::Mythkin::": ["Satyr", "Sphinx"],
    "::Aviankin::": ["Falcon::Gender::", "Vulture::Gender::", "Owl::Gender::"],
    "::Reptilekin::": ["Tortle"],
    "::Amphibiankin::": ["Borgle", "Froglord"],
    "::Gender::": ["-man", "boy", "-woman", "girl", "folk", "kin", "-person", "-thing"],
};

let start_string = "::R::";
const rule_regex = /::[A-z]*::/i;

function replaceGrammarRules(inputString) {
    let outputString = inputString;
    let matches = outputString.match(rule_regex);
    
    while(matches && matches.length > 0) {
        console.log(outputString);
        let rule = matches[0];
        let ruleChildren = grammar_rules[rule]
        let replacement = rChoice(ruleChildren);
        outputString = outputString.replace(rule, replacement);
        matches = outputString.match(rule_regex);
    }

    return outputString;
}

function rChoice(arr) {
    if (!arr) return '';
    return arr[Math.floor(Math.random() * arr.length)];
}

let generated = replaceGrammarRules(start_string);
console.log(generated);
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("output").innerText = `You are a ${generated}`;
})