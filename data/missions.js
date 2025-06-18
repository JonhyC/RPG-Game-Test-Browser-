const missions = [
    {
        name: "Coletar Cajado de Madeira",
        giver: "Velho Sábio",
        task: "Encontre o meu Cajado de Madeira perdido na floresta..",
        description: "O Velho Sábio precisa que você encontre o seu Cajado de Madeira perdido na floresta.",
        objective: "Obter o item 'Cajado de Madeira'",
        area: "Floresta",
        type: "Coleta",
        level: 1,
        condition: (inventory) => inventory.includes("Cajado de Madeira"),
        reward: (inventory) => {
            inventory.push("Poção de Cura");
            return "Você recebeu uma Poção de Cura!";
        }
    }
];
