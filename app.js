const { createApp, ref, computed, watch } = Vue;

// Funzione per generare un valore casuale tra min e max
const generateRandomValue = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const myApp = createApp({
    setup() {
        const playerHealth = ref(100);
        const enemyHealth = ref(100);
        const round = ref(0);
        const winner = ref(null);
        const logMessages = ref([]);
        const newGame = () => {
            playerHealth.value = 100;
            enemyHealth.value = 100;
            round.value = 0;
            winner.value = null;
            logMessages.value = [];
        }

        const attackPlayer = () => {
            const attackValue = generateRandomValue(8, 15); 
            if(playerHealth.value - attackValue <= 0){
                playerHealth.value = 0;
            }else {
                playerHealth.value -= attackValue;
            }
            addLogMessage('enemy', 'attack', attackValue);
        };
        
        // Funzione per l'attacco del giocatore al nemico
        const attackEnemy = () => {
            const attackValue = generateRandomValue(5, 12); 
            if(enemyHealth.value - attackValue <= 0){
                enemyHealth.value = 0;
            }else {
                enemyHealth.value -= attackValue;
            }
            round.value++; 
            addLogMessage('player', 'attack', attackValue);
            attackPlayer(); 
        };

        const attackEnemySpecial = () => {
            const specialAttackValue = generateRandomValue(10, 25);
            if(enemyHealth.value - specialAttackValue <= 0){
                enemyHealth.value = 0;
            } else {
                enemyHealth.value -= specialAttackValue;
            }
            round.value++;
            addLogMessage('player', 'special-attack', specialAttackValue);
            attackPlayer(); 
        };

        const gameover = () => {
            winner.value = "enemy";
            playerHealth.value = 0;
        };

        const medikit = () => {
            const medikitValue = generateRandomValue(8, 15);
            if (playerHealth.value + medikitValue > 100) {
                playerHealth.value = 100;
            }else{
                playerHealth.value += medikitValue;
            }
            round.value++;
            addLogMessage('player', 'medikit', medikitValue);
            attackPlayer(); 
        };

        // Stile della barra di salute del giocatore
        const playerBarStyles = computed(() => {
            return { width : playerHealth.value + '%' };
        });

        // Stile della barra di salute del nemico
        const enemyBarStyles = computed(() => {
            return { width : enemyHealth.value + '%' };
        });

        // Disabilita l'attacco speciale ogni 3 round
        const attackEnemyDisabled = computed(() => {
            return round.value % 3 !== 0;
        });

        const medikitDisabled = computed(() => {
            return playerHealth.value >= 50 || round.value % 3 !== 0;
        });

        const addLogMessage = (who, what, value) => {
            logMessages.value.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
                timestamp: new Date().getTime()
            });
        };

        watch(enemyHealth, (newHealth) => {
            if (newHealth <= 0 && playerHealth.value <= 0) {
                winner.value = 'draw';
            } else if (newHealth <= 0) {
                winner.value = 'player';
            }
        });

        watch(playerHealth, (newHealth) => {
            if (newHealth <= 0 && enemyHealth.value <= 0) {
                winner.value = 'draw';
            } else if (newHealth <= 0) {
                winner.value = 'enemy';
            }
        });

        return {
            attackEnemy,
            attackEnemySpecial,
            gameover,
            medikit,
            playerHealth,
            enemyHealth,
            round,
            playerBarStyles,
            enemyBarStyles,
            attackEnemyDisabled,
            medikitDisabled,
            winner,
            logMessages,
            newGame
        };
    }
});

myApp.mount('#game');
