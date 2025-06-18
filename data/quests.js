const quests = [
    {
        id: 1,
        name: "A Espada Perdida",
        description: "Encontre a Espada em alguma parte do mapa.",
        objective: "Obter 'Espada'",
        reward: (inventory) => {
            inventory.push("Poção de Vida");
            return "Você recebeu uma Poção de Vida!";
        },
        condition: (inventory) => inventory.includes("Espada"),
        giver: "Velho Guerreiro",
        area: "Floresta",
        type: "Busca",
        level: 1,
        status: "não aceita"
    },
    {
        id: 2,
        name: "A Pedra Mágica",
        description: "Recupere uma Pedra Mágica da Caverna.",
        objective: "Obter 'Pedra Mágica'",
        reward: (inventory) => {
            inventory.push("Anel de Mana");
            return "Você recebeu um Anel de Mana!";
        },
        condition: (inventory) => inventory.includes("Pedra Mágica"),
        giver: "Mago Azul",
        area: "Caverna",
        type: "Aventura",
        level: 2,
        status: "não aceita"
    }
];