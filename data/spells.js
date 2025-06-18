const spells = [
    {
        name: "Cura",
        cost: 10,
        effect: (state) => {
            state.playerHP = Math.min(state.playerHP + 10, state.maxHP);
            return "✨ Você se curou em 10 de HP!";
        }
    },
    {
        name: "Bola de Fogo",
        cost: 15,
        effect: (state) => {
            if (state.enemy) {
                state.enemy.hp -= 10;
                return "🔥 Você lançou uma bola de fogo!";
            }
            return "Nenhum inimigo para atacar!";
        }
    },
    {
        name: "Escudo Mágico",
        cost: 12,
        effect: (state) => {
            state.shieldTurns = 3;
            return "🛡️ Você conjurou um escudo mágico por 3 turnos!";
        }
    }
];
