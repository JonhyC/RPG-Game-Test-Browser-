document.addEventListener("DOMContentLoaded", () => {
    // === Variáveis do jogo ===
    let rocks = Number(localStorage.getItem("rocks")) || 0;
    let coltdRocks = Number(localStorage.getItem("coltdRocks")) || 0;
    let hasSword = JSON.parse(localStorage.getItem("hasSword")) || false;
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    let playerHP = 30;
    let enemy = null;
    let currentSlot = 1;
    let shieldTurns = 0;

    // === Elementos do DOM ===
    const rocksDisplay = document.getElementById("rocks");
    const coltdRocksDisplay = document.getElementById("coltdRocks");
    const colRocks = document.getElementById("colRocks");
    const shop = document.getElementById("shop");
    const swordStatus = document.getElementById("swordStatus");
    const magic = document.getElementById("magic");
    const inventoryDiv = document.getElementById("inventory");
    const inventoryList = document.getElementById("inventoryList");
    const map = document.getElementById("map");
    const mapMsg = document.getElementById("mapMsg");
    const combatDiv = document.getElementById("combat");
    const enemyName = document.getElementById("enemyName");
    const enemyHP = document.getElementById("enemyHP");
    const playerHPDisplay = document.getElementById("playerHP");
    const attackBtn = document.getElementById("attackBtn");
    const combatLog = document.getElementById("combatLog");
    const areaSelect = document.getElementById("areaSelect");

    // Elementos missão
    const missionDiv = document.getElementById("mission");
    const missionText = document.getElementById("missionText");
    const missionBtn = document.getElementById("missionBtn");
    const acceptmissionBtn = document.getElementById("acceptmissionBtn");
    const completemissionBtn = document.getElementById("completemissionBtn");
    const missionStatus = document.getElementById("missionStatus");
    const missionReward = document.getElementById("missionReward");
    const missionDescription = document.getElementById("missionDescription");
    const missionObjective = document.getElementById("missionObjective");
    const missionProgress = document.getElementById("missionProgress");
    const missionName = document.getElementById("missionName");
    const missionArea = document.getElementById("missionArea");
    const missionType = document.getElementById("missionType");
    const missionLevel = document.getElementById("missionLevel");
    const missionGiver = document.getElementById("missionGiver");
    const missionLog = document.getElementById("missionLog");

    // Elementos da loja
    const buySwordBtn = document.getElementById("buySwordBtn");
    const buyPHealBtn = document.getElementById("buyPHealBtn");
    const buyPShieldBtn = document.getElementById("buyPShieldBtn");
    const usePotionBtn = document.getElementById("usePotionBtn");
    const useShieldBtn = document.getElementById("useShieldBtn");

    // Elementos Vila
    const vilaDiv = document.getElementById("vila");
    const visitVilaBtn = document.getElementById("visitVilaBtn");
    const blackMarketDiv = document.getElementById("blackMrk");
    const enterblackMrkBtn = document.getElementById("enterblackMrkBtn");
    const blackMrkDeal = document.getElementById("blackMrkDeal");
    const fraseBL1 = document.getElementById("fraseBL1");
    const fraseBLD1 = document.getElementById("fraseBLD1");
    const buy = document.getElementById("buy");
    const sell = document.getElementById("sell");

    // === CODIGO DO JOGO ===

    // === Função para atualizar o jogo ===
    function updateDisplay() {
        rocksDisplay.textContent = rocks;
        coltdRocksDisplay.textContent = coltdRocks;
        playerHPDisplay.textContent = playerHP;

        if (coltdRocks > 0) {
            coltdRocksDisplay.parentElement.classList.remove("hidden");
        } else {
            coltdRocksDisplay.parentElement.classList.add("hidden");
        }

        if ((rocks > 40 || coltdRocks >= 20)) {
            shop.classList.remove("hidden");
        } else {
            shop.classList.add("hidden");
        }

        if (hasSword === true) {
            buySwordBtn.classList.add("hidden");
        } else {
            buySwordBtn.classList.remove("hidden");
        }

        if (rocks >= 60 || coltdRocks >= 40) {
            magic.classList.remove("hidden");
        } else {
            magic.classList.add("hidden");
        }

        if (rocks >= 80 || coltdRocks >= 60) {
            map.classList.remove("hidden");
        } else {
            map.classList.add("hidden");
        }

        if (inventory.length > 0) {
            inventoryDiv.classList.remove("hidden");
        } else {
            inventoryDiv.classList.add("hidden");
        }

        if (coltdRocks >= 15 || rocks >= 25) {
            areaSelect.classList.remove("hidden");
        } else {
            areaSelect.classList.add("hidden");
        }

        if (coltdRocks >= 50 || rocks >= 80) {
            document.getElementById("mission").classList.remove("hidden");
        } else {
            document.getElementById("mission").classList.add("hidden");
        }

        // Atualiza inventário na tela
        inventoryList.innerHTML = "";

        const itemCounts = {};
        inventory.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });

        for (const [item, count] of Object.entries(itemCounts)) {
            const li = document.createElement("li");
            li.textContent = (count > 1 ? `${count}x ` : "") + item;
            inventoryList.appendChild(li);
        }


        // Armazenar localmente
        localStorage.setItem("rocks", rocks);
        localStorage.setItem("coltdRocks", coltdRocks);
        localStorage.setItem("hasSword", JSON.stringify(hasSword));
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }


    // === Spells (magias) ===
    const spells = [
        {
            name: "Escudo",
            cost: 20,
            effect: () => {
                shieldTurns = 3;
                return "Você lançou um Escudo mágico! Escudo ativo por 3 turnos.";
            }
        },
        {
            name: "Bola de Fogo",
            cost: 30,
            effect: () => {
                if (enemy) {
                    enemy.hp -= 10;
                    if (enemy.hp <= 0) {
                        combatLog.textContent += `\nVocê derrotou o ${enemy.name} com a magia!`;
                        enemy = null;
                        combatDiv.classList.add("hidden");
                    }
                    return "Bola de Fogo causou 10 de dano!";
                }
                return "Sem inimigo para atacar!";
            }
        }
    ];


    // === Missão ===
    function updateMissionDisplay() {
        if (!currentMission) return;

        missionName.textContent = currentMission.name;
        missionGiver.textContent = currentMission.giver;
        missionDescription.textContent = currentMission.description;
        missionObjective.textContent = currentMission.objective;
        missionArea.textContent = currentMission.area;
        missionType.textContent = currentMission.type;
        missionLevel.textContent = currentMission.level;

        if (!missionAccepted) {
            missionStatus.textContent = "Não iniciada";
            missionProgress.textContent = "Progresso: 0%";
            acceptmissionBtn.classList.remove("hidden");
            completemissionBtn.classList.add("hidden");
        } else if (missionAccepted && !missionCompleted) {
            missionStatus.textContent = "Em andamento";
            missionProgress.textContent = currentMission.condition(inventory) ? "Progresso: 100%" : "Progresso: 0%";
            completemissionBtn.classList.remove("hidden");
            acceptmissionBtn.classList.add("hidden");
        } else if (missionCompleted) {
            missionStatus.textContent = "Concluída";
            missionProgress.textContent = "Progresso: 100%";
            acceptmissionBtn.classList.add("hidden");
            completemissionBtn.classList.add("hidden");
        }
    }

    missionBtn.addEventListener("click", () => {
        missionLog.classList.remove("hidden");
        updateMissionDisplay();
    });

    acceptmissionBtn.addEventListener("click", () => {
        missionAccepted = true;
        missionLog.textContent += `\nMissão aceita: ${currentMission.name}`;
        updateMissionDisplay();
    });

    completemissionBtn.addEventListener("click", () => {
        if (!currentMission.condition(inventory)) {
            alert("Você ainda não completou o objetivo da missão!");
            return;
        }

        missionCompleted = true;
        const rewardMsg = currentMission.reward(inventory);
        missionReward.textContent = rewardMsg;
        missionLog.textContent += `\nMissão concluída! ${rewardMsg}`;
        updateMissionDisplay();
        updateDisplay();

        if (missionCompleted === true) {
            missionArea.classList.add("hidden");
            updateDisplay();
        }
    });


    // === Missão exemplo ===
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
            condition: (inv) => inv.includes("Cajado de Madeira"),
            reward: (inv) => {
                inv.push("Poção de Cura");
                return "Você recebeu uma Poção de Cura!";
            }
        }
    ];

    let currentMission = missions[0];
    let missionAccepted = false;
    let missionCompleted = false;


    // === Resetar jogo ===
    document.getElementById("resetBtn").addEventListener("click", () => {
        if (confirm("Tem certeza que deseja reiniciar o jogo?")) {
            // Limpar localStorage
            localStorage.clear();

            // Resetar variáveis locais
            rocks = 0;
            coltdRocks = 0;
            hasSword = false;
            inventory = [];
            playerHP = 30;
            shieldTurns = 0;
            enemy = null;
            currentSlot = 1;
            missionAccepted = false;
            missionCompleted = false;

            // Recarregar página
            location.reload();
        }
    });


    // === Geração automática de rochas ===
    setInterval(() => {
        rocks++;
        updateDisplay();
    }, 1000);


    // === Coletar rochas ===
    document.getElementById("collectRock").addEventListener("click", () => {
        if (rocks > 0) {
            coltdRocks += rocks;
            rocks = 0;
            colRocks.classList.remove("hidden");
            updateDisplay();
        }
    });


    // === Loja ==
    // === Comprar espada ===
    document.getElementById("buySwordBtn").addEventListener("click", () => {
        if (!hasSword) {
            if (rocks >= 30) {
                rocks -= 30;
            } else if (coltdRocks >= 20) {
                coltdRocks -= 20;
            } else {
                alert("Você não tem rochas suficientes para comprar a espada!");
                return;
            }
            hasSword = true;
            swordStatus.classList.remove("hidden");
            inventory.push("Espada");
            updateDisplay();
        }
    });

    // === Comprar poção de vida ===
    document.getElementById("buyPHealBtn").addEventListener("click", () => {
        if (rocks >= 80 || coltdRocks >= 60) {
            if (rocks >= 80) {
                rocks -= 80;
            } else if (coltdRocks >= 60) {
                coltdRocks -= 60;
            }
            playerHP += 10;
            alert("Você comprou uma Poção de Vida! HP restaurado.");
            updateDisplay();
        } else {
            alert("Você não tem rochas suficientes para comprar a poção!");
        }
        inventory.push("Poção de Vida");
    });

    // === Comprar escudo ===
    document.getElementById("buyPShieldBtn").addEventListener("click", () => {
        if (rocks >= 120 || coltdRocks >= 100) {
            if (rocks >= 120) {
                rocks -= 120;
            } else if (coltdRocks >= 100) {
                coltdRocks -= 100;
            }
            shieldTurns = 3; // Ativar escudo por 3 turnos
            alert("Você comprou um Escudo! Escudo ativo por 3 turnos.");
            updateDisplay();
        } else {
            alert("Você não tem rochas suficientes para comprar o escudo!");
        }
        inventory.push("Poção de Escudo");
    });
    // === Fim da loja ===


    // === Usar Poções ===
    // === Usar Poção de Vida ===
    document.getElementById("usePotionBtn").addEventListener("click", () => {
        if (inventory.includes("Poção de Vida")) {
            playerHP += 10;
            inventory = inventory.filter(item => item !== "Poção de Vida");
            alert("Você usou uma Poção de Vida! HP restaurado.");
            updateDisplay();
        } else {
            alert("Você não tem Poções de Vida no inventário!");
        }

        if (playerHP = 30) {
            usePotionBtn.classList.add("hidden");
        } else {
            usePotionBtn.classList.remove("hidden");
        }
    });

    // === Usar Poção de Escudo ===
    document.getElementById("useShieldBtn").addEventListener("click", () => {
        if (inventory.includes("Escudo")) {
            shieldTurns = 3; // Ativar escudo por 3 turnos
            inventory = inventory.filter(item => item !== "Escudo");
            alert("Você usou um Escudo! Escudo ativo por 3 turnos.");
            updateDisplay();
        } else {
            alert("Você não tem Escudos no inventário!");
        }
    });
    // === Fim das poções ===


    // === Explorar (iniciar combate) ===
    document.getElementById("exploreBtn").addEventListener("click", () => {
        // Verificar se o jogador possui uma espada
        if (!hasSword) {
            mapMsg.textContent = "É perigoso explorar sem uma espada!";
            return;
        }

        // Obter a área selecionada (caso não haja, a área padrão será "Floresta")
        const area = areaSelect.value || "Floresta";

        // Gerar um inimigo para a área selecionada
        enemy = generateEnemy(area);

        // Mostrar os detalhes do combate
        combatDiv.classList.remove("hidden");  // Tornar a área de combate visível
        enemyName.textContent = enemy.name;    // Nome do inimigo
        enemyHP.textContent = enemy.hp;        // HP do inimigo
        combatLog.textContent = `Você encontrou um ${enemy.name}!`;  // Mensagem de combate
    });

    // Função para gerar um inimigo com base na área
    function generateEnemy(area) {
        const enemiesByArea = {
            Floresta: [
                { name: "Slime", hp: 10, damage: 2, reward: "Pedra Mágica" },
                { name: "Goblin", hp: 15, damage: 3, reward: "Ouro" },
                { name: "Lobo Selvagem", hp: 12, damage: 4, reward: "Pele de Lobo" }
            ],
            Caverna: [
                { name: "Esqueleto", hp: 20, damage: 5, reward: "Ossos" },
                { name: "Morcego Gigante", hp: 25, damage: 6, reward: "Asa de Morcego" },
                { name: "Aranha Venenosa", hp: 18, damage: 4, reward: "Veneno" }
            ],
            Castelo: [
                { name: "Cavaleiro Sombrio", hp: 40, damage: 10, reward: "Espada Antiga" },
                { name: "Feiticeiro", hp: 35, damage: 12, reward: "Livro de Magias" },
                { name: "Guardião Real", hp: 50, damage: 8, reward: "Coroa" }
            ]
        };

        // Se a área não for encontrada, retorna um inimigo genérico
        const enemies = enemiesByArea[area] || [{ name: "Rato", hp: 5, damage: 1 }];

        // Retorna um inimigo aleatório da lista da área
        return { ...enemies[Math.floor(Math.random() * enemies.length)] };
    }


    // === Combate ===
    attackBtn.addEventListener("click", () => {
        if (!enemy) return;

        const playerDamage = hasSword ? 5 : 1;
        enemy.hp -= playerDamage;
        combatLog.textContent = `Você atingiu o ${enemy.name} com ${playerDamage} de dano!`;

        if (enemy.hp <= 0) {
            combatLog.textContent += `\nVocê derrotou o ${enemy.name}!`;
            inventory.push(`Loot do ${enemy.name}`);

            // Verificar chance de item raro por área
            const area = areaSelect.value || "Floresta";
            const rareDropChance = Math.random(); // Número entre 0 e 1 (7% = 0.07)

            let rareItem = null;
            if (area === "Floresta" && rareDropChance < 0.07) {
                rareItem = "Cajado de Madeira";
                alert("Você encontrou um Cajado de Madeira que estava perdido na floresta!");
            } else if (area === "Caverna" && rareDropChance < 0.07) {
                rareItem = "Elmo Antigo";
                alert("Você encontrou um Elmo Antigo raro!");
            } else if (area === "Castelo" && rareDropChance < 0.07) {
                rareItem = "Anel Mágico";
                alert("Você encontrou um Anel Mágico raro!");
            }

            if (rareItem) {
                inventory.push(rareItem);
                combatLog.textContent += `\n✨ Você encontrou um item raro: ${rareItem}!`;
            }

            combatDiv.classList.add("hidden");
            enemy = null;
            updateDisplay();
            return;
        }


        if (shieldTurns > 0) {
            shieldTurns--;
            combatLog.textContent += `\nVocê bloqueou o ataque do inimigo com o escudo! (${shieldTurns} turnos restantes)`;
        } else {
            playerHP -= enemy.damage;
            combatLog.textContent += `\nO ${enemy.name} te atacou com ${enemy.damage} de dano!`;
        }

        if (playerHP <= 0) {
            combatLog.textContent += `\n💀 Você morreu! Reiniciando...`;
            setTimeout(() => {
                localStorage.clear();
                location.reload();
            }, 2000);
        }

        enemyHP.textContent = enemy.hp;
        updateDisplay();
    });


    // === Magias ===
    spells.forEach(spell => {
        const btn = document.createElement("button");
        btn.textContent = `${spell.name} (${spell.cost} rochas)`;
        btn.addEventListener("click", () => {
            if (rocks >= spell.cost) {
                rocks -= spell.cost;
                const msg = spell.effect();
                alert(msg);
                updateDisplay();
            } else {
                alert("Você não tem rochas suficientes!");
            }
        });
    });


    // === Funcionalidades com Itens ===

    function itensFunc() {
        // Verifica se o jogador possui o Cajado de Madeira
        if (inventory.includes("Cajado de Madeira")) {
            alert("Descubra para que o Cajado de Madeira pode ser usado Ou devolva o Cajado de Madeira ao Velho Sábio na Floresta!");
            vilaDiv.classList.remove("hidden");

            // Garante que o evento só será adicionado uma vez
            if (!visitVilaBtn.dataset.listenerAdded) {
                visitVilaBtn.dataset.listenerAdded = "true";

                visitVilaBtn.addEventListener("click", () => {
                    alert("Você entrou na Vila do Comércio!");

                    // 8% de chance de aparecer o Mercado Negro
                    const chance = Math.random();
                    if (chance <= 0.08) {
                        alert("Você encontrou uma entrada secreta para o Mercado Negro!");
                        document.getElementById("blackMrk").classList.remove("hidden");

                        document.getElementById("enterblackMrkBtn").addEventListener("click", () => {
                            document.getElementById("blackMrkDeal").classList.remove("hidden");
                            document.getElementById("buy").classList.remove("hidden");
                            document.getElementById("sell").classList.remove("hidden");
                        });
                    } else if (chance <= 0.2) {
                        alert("Você encontrou o Vendedor da Vila 'Mouzert' na Praça Publica da Lua.")
                        document.getElementById("seller").classList.remove("hidden");
                        document.getElementById("fraseSeller1").classList.remove("hidden");
                        if (document.getElementById("fraseSeller1") === true) {
                            // Prox Frase
                            document.getElementById("nextFraseSeller").addEventListener("click", () => {
                                document.getElementById("fraseSeller1").classList.add("hidden");
                                document.getElementById("fraseSeller2").classList.remove("hidden");
                            });
                        }
                        if (document.getElementById("fraseSeller2") === true) {
                            // Prox Frase
                            document.getElementById("nextFraseSeller2").addEventListener("click", () => {
                                document.getElementById("fraseSeller2").classList.add("hidden");
                                document.getElementById("productsSellerVila").classList.remove("hidden");
                                document.getElementById("fraseSeller3").classList.remove("hidden");
                                document.getElementById("listProductsSellerVila").classListl.remove("hidden");
                            });
                        }
                    } else {
                        alert("A vila está tranquila... mas nada suspeito por agora.");
                        document.getElementById("blackMrk").classList.add("hidden");
                        document.getElementById("blackMrkDeal").classList.add("hidden");
                        document.getElementById("buy").classList.add("hidden");
                        document.getElementById("sell").classList.add("hidden");
                    }
                });
            }
        }

        // Verifica se o jogador possui o Elmo Antigo
        if (inventory.includes("Elmo Antigo")) {
            alert("Você encontrou um Elmo Antigo! Ele pode ser útil em batalhas futuras.");
            // Aqui você pode adicionar a lógica para usar o Elmo Antigo
        }

        // Verifica se o jogador possui o Anel Mágico
        if (inventory.includes("Anel Mágico")) {
            alert("Você encontrou um Anel Mágico! Ele pode aumentar seu poder mágico.");
            // Aqui você pode adicionar a lógica para usar o Anel Mágico
        }
    }
})