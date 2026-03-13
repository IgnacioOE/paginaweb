// terminal de batalla
(function () {
    const logHTML = `
        <div class="battle-log-container">
            <div class="battle-log" id="battleLog">
                <div id="logContent"></div>
            </div>
        </div>

        <style>
            .battle-log-container {
                display: flex;
                justify-content: center;
                padding: 0 20px 10px;
                background-color: #111;
            }

            .battle-log {
                width: 100%;
                max-width: 1000px;
                background-color: #0d0d0d;
                border: 2px solid #333;
                border-radius: 10px;
                padding: 12px 16px;
                height: 180px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #ccc;
                box-sizing: border-box;
            }

            .battle-log::-webkit-scrollbar { width: 6px; }
            .battle-log::-webkit-scrollbar-track { background: #1a1a1a; }
            .battle-log::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

            .log-entry { margin: 4px 0; line-height: 1.4; }
            .log-p1 { color: #66ccff; }
            .log-p2 { color: #ff9966; }
            .log-event { color: #ffd700; font-weight: bold; }
        </style>
    `;

    document.currentScript.insertAdjacentHTML('afterend', logHTML);
})();

function battleLog(message, type = 'event') {
    const logContent = document.getElementById('logContent');
    const entry = document.createElement('p');
    entry.textContent = '> ' + message;
    entry.className = 'log-entry log-' + type;
    logContent.appendChild(entry);
    document.getElementById('battleLog').scrollTop = 99999;
}

// Lógica de batalla

const MAX_HP = 100;
const MAX_BATTLE_TURNS = 20;
let hp1 = MAX_HP;
let hp2 = MAX_HP;
let p1Name = '';
let p2Name = '';
let p1DefenseActive = false;
let p2DefenseActive = false;
let p1SpecialDefActive = false;
let p2SpecialDefActive = false;
let battleOver = false;
let p1TurnCount = 0;
let p2TurnCount = 0;
let p1LastSpecialAttack = -99;
let p2LastSpecialAttack = -99;
let p1LastSpecialDef = -99;
let p2LastSpecialDef = -99;
let totalTurnCount = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateHealthBar(hpBarId, hpTextId, hp) {
    const pct = Math.max(0, Math.round(hp));
    const bar = document.getElementById(hpBarId);
    bar.style.width = pct + '%';
    document.getElementById(hpTextId).textContent = pct + '%';
    if (pct > 50) bar.style.backgroundColor = '#4CAF50';
    else if (pct > 20) bar.style.backgroundColor = '#FFC107';
    else bar.style.backgroundColor = '#e01818';
}

function updateSpriteVisibility(winner) {
    const playerSprite = document.getElementById('img1');
    const opponentSprite = document.getElementById('img2');

    if (!playerSprite || !opponentSprite) return;

    playerSprite.style.opacity = '1';
    opponentSprite.style.opacity = '1';

    if (winner === 'p1') {
        opponentSprite.style.opacity = '0';
    } else if (winner === 'p2') {
        playerSprite.style.opacity = '0';
    }
}

function finishBattleByWinner(winner, message) {
    battleLog(message, 'event');
    updateSpriteVisibility(winner);
    battleOver = true;
}

function pickMove(isP1) {
    const actorTurn = isP1 ? p1TurnCount : p2TurnCount;
    const lastSpecialAtk = isP1 ? p1LastSpecialAttack : p2LastSpecialAttack;
    const lastSpecialDef = isP1 ? p1LastSpecialDef : p2LastSpecialDef;
    const available = BATTLE_MOVES.filter(m => {
        if (m.type === 'special-attack') {
            if (actorTurn < 4) return false;
            if ((actorTurn - lastSpecialAtk) < 3) return false;
        }
        if (m.type === 'special-defense') {
            if (actorTurn < 3) return false;
            if ((actorTurn - lastSpecialDef) < 2) return false;
        }
        return true;
    });
    return available[Math.floor(Math.random() * available.length)];
}

function applyMove(move, attackerName, defenderName, isP1Attacker) {
    const actorType = isP1Attacker ? 'p1' : 'p2';
    const hit = Math.random() < move.accuracy;

    if (!hit) {
        battleLog(attackerName + ' usó ' + move.name + '... ¡y falló!', actorType);
        return;
    }

    if (move.type === 'defense') {
        if (isP1Attacker) p1DefenseActive = true;
        else p2DefenseActive = true;
        battleLog(attackerName + ' usó ' + move.name + '. ¡Bloqueará el próximo golpe recibido!', actorType);
        return;
    }

    if (move.type === 'special-defense') {
        if (isP1Attacker) { p1SpecialDefActive = true; p1LastSpecialDef = p1TurnCount; }
        else { p2SpecialDefActive = true; p2LastSpecialDef = p2TurnCount; }
        battleLog(attackerName + ' usó ' + move.name + '. ¡El próximo golpe recibirá solo el 50% de daño!', actorType);
        return;
    }

    const defActive = isP1Attacker ? p2DefenseActive : p1DefenseActive;
    const specDefActive = isP1Attacker ? p2SpecialDefActive : p1SpecialDefActive;
    let dmg = move.damage;
    let note = '';

    if (defActive) {
        dmg = 0;
        if (isP1Attacker) p2DefenseActive = false;
        else p1DefenseActive = false;
        note = ' (¡' + defenderName + ' lo bloqueó por completo!)';
    } else if (specDefActive) {
        dmg = Math.round(dmg * 0.5);
        if (isP1Attacker) p2SpecialDefActive = false;
        else p1SpecialDefActive = false;
        note = ' (¡Mitad del daño gracias a Defensa Especial!)';
    }

    if (isP1Attacker) {
        hp2 = Math.max(0, hp2 - dmg);
        updateHealthBar('hp2', 'hpText2', hp2);
    } else {
        hp1 = Math.max(0, hp1 - dmg);
        updateHealthBar('hp1', 'hpText1', hp1);
    }

    if (move.type === 'special-attack') {
        if (isP1Attacker) p1LastSpecialAttack = p1TurnCount;
        else p2LastSpecialAttack = p2TurnCount;
    }
    battleLog(attackerName + ' usó ' + move.name + ' → ' + dmg + ' de daño a ' + defenderName + '.' + note, actorType);
}

async function runBattle() {
    await sleep(800);
    battleLog('¡La batalla entre ' + p1Name + ' y ' + p2Name + ' comienza!', 'event');
    await sleep(800);

    while (!battleOver && hp1 > 0 && hp2 > 0) {
        p1TurnCount++;
        totalTurnCount++;
        const move1 = pickMove(true);
        applyMove(move1, p1Name, p2Name, true);
        await sleep(1200);

        if (hp2 <= 0) {
            finishBattleByWinner('p1', '¡' + p2Name + ' se ha debilitado! ¡' + p1Name + ' gana!');
            break;
        }

        if (totalTurnCount >= MAX_BATTLE_TURNS) {
            if (hp1 > hp2) {
                finishBattleByWinner('p1', 'Se alcanzaron 20 turnos. ¡' + p1Name + ' gana por mayor vida restante!');
            } else if (hp2 > hp1) {
                finishBattleByWinner('p2', 'Se alcanzaron 20 turnos. ¡' + p2Name + ' gana por mayor vida restante!');
            } else {
                finishBattleByWinner(null, 'Se alcanzaron 20 turnos. ¡Empate por misma vida restante!');
            }
            break;
        }

        p2TurnCount++;
        totalTurnCount++;
        const move2 = pickMove(false);
        applyMove(move2, p2Name, p1Name, false);
        await sleep(1200);

        if (hp1 <= 0) {
            finishBattleByWinner('p2', '¡' + p1Name + ' se ha debilitado! ¡' + p2Name + ' gana!');
            break;
        }

        if (totalTurnCount >= MAX_BATTLE_TURNS) {
            if (hp1 > hp2) {
                finishBattleByWinner('p1', 'Se alcanzaron 20 turnos. ¡' + p1Name + ' gana por mayor vida restante!');
            } else if (hp2 > hp1) {
                finishBattleByWinner('p2', 'Se alcanzaron 20 turnos. ¡' + p2Name + ' gana por mayor vida restante!');
            } else {
                finishBattleByWinner(null, 'Se alcanzaron 20 turnos. ¡Empate por misma vida restante!');
            }
            break;
        }

        await sleep(400);
    }
}

function startBattle(name1, name2) {
    hp1 = MAX_HP;
    hp2 = MAX_HP;
    p1DefenseActive = false;
    p2DefenseActive = false;
    p1SpecialDefActive = false;
    p2SpecialDefActive = false;
    battleOver = false;
    p1TurnCount = 0;
    p2TurnCount = 0;
    p1LastSpecialAttack = -99;
    p2LastSpecialAttack = -99;
    p1LastSpecialDef = -99;
    p2LastSpecialDef = -99;
    totalTurnCount = 0;

    p1Name = name1;
    p2Name = name2;

    updateHealthBar('hp1', 'hpText1', hp1);
    updateHealthBar('hp2', 'hpText2', hp2);
    updateSpriteVisibility(null);
    runBattle();
}
