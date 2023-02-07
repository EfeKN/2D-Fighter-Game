const canv = document.querySelector('canvas') 

//Query Selector lets you find the first element that matches the CSS Selector

/*
The HTML DOM Document Object
The document object represents your web page.

If you want to access any element in an HTML page, you always start with accessing the document object.

Below are some examples of how you can use the document object to access and manipulate HTML.
*/

//Adjust resolution | 16:9
canv.width = 1024;
canv.height = 576;

const c = canv.getContext('2d');

const gravity = 0.2
const speed = 5
const hop = 10
const cooldown = 100
const hp = 100

const bg = new Sprite({
    position:{x:0, y:0},
    imgSrc:'./img/background.png'
})

const shop = new Sprite({
    position:{x:620, y:133},
    imgSrc:'./img/shop.png',
    scale:2.7,
    frames:6
})

const player = new Fighter({
    position:{x:0, y:0},
    velocity:{x:0, y:0},
    imgSrc:'./img/p1/Idle.png',
    frames: 8,
    scale: 2.5,
    offset: {x:215,y:157},
    sprites: {
        idle: {
            imgSrc: './img/p1/Idle.png',
            frames: 8
        },
        run: {
            imgSrc: './img/p1/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './img/p1/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './img/p1/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './img/p1/Attack1.png',
            frames: 6
        },
        attack2: {
            imgSrc: './img/p1/Attack2.png',
            frames: 6
        }
    }
    })

const enemy = new Fighter({
    position:{x:974, y:0},
    velocity:{x:0, y:0},
    color:'yellow',
    imgSrc:'./img/p2/Idle.png',
    frames: 4,
    scale: 2.5,
    offset: {x:215,y:170},
    sprites: {
        idle: {
            imgSrc: './img/p2/Idle.png',
            frames: 4
        },
        run: {
            imgSrc: './img/p2/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './img/p2/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './img/p2/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './img/p2/Attack1.png',
            frames: 4
        },
        attack2: {
            imgSrc: './img/p2/Attack2.png',
            frames: 4
        }
    }
    })

const keys =
{
    w: {pressed:false},
    a: {pressed:false},
    d: {pressed:false},
    aUp: {pressed:false},
    aLeft: {pressed:false},
    aRight: {pressed:false}
}

function checkCollusion({rect1,rect2}) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function determineWinner({player,enemy,timerID}) {
    clearTimeout(timerID)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health == enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Tie'     
    } else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'  
    } else if(player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'  
    }
}

let timer = 60
let timerID
function decTimer() {
    timerID = setTimeout(decTimer,1000 /* 1 sec = 1000 units */)
    if(timer > 0)
    {
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer == 0) {
        determineWinner({player,enemy,timerID})
    }
}

decTimer()

//Animation Loop
function animate() {
    window.requestAnimationFrame(animate) // ---> infinite loop
    c.clearRect(0,0,canv.width,canv.height)
    c.fillStyle = 'black'
    c.fillRect(0,0,canv.width,canv.height)
    c.fillStyle = 'red'
    bg.draw()
    shop.draw()
    shop.update()
    player.update()
    enemy.update()

    //Player Movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lk == 'a') {
        player.velocity.x = -1 * speed
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lk == 'd') {
        player.velocity.x = speed
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy Movement
    enemy.velocity.x = 0
    if(keys.aLeft.pressed && enemy.lk == 'ArrowLeft') {
        enemy.velocity.x = -1 * speed
        enemy.switchSprite('run')
    }
    else if(keys.aRight.pressed && enemy.lk == 'ArrowRight') {
        enemy.velocity.x = speed
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //collusion detection
    if (checkCollusion({rect1:player,rect2:enemy}) && player.isAttacking)
    {
        player.isAttacking = false
        console.log('player_attacking')
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (checkCollusion({rect1:enemy,rect2:player}) && enemy.isAttacking)
    {
        enemy.isAttacking = false
        console.log('enemy_attacking')
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // game over condition
    if(enemy.health <= 0 || player.health<= 0)
    {
        determineWinner({player,enemy,timerID})
    }
}

animate()

//Add event listener
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'w':
            player.velocity.y = -1 * hop
            break
        case 'a':
            keys.a.pressed = true
            player.lk = 'a'
            break
        case 'd':
            keys.d.pressed = true
            player.lk = 'd'
            break
        case ' ':
            player.attack()
            break
        case 'ArrowUp':
            enemy.velocity.y = -1 * hop
            break
        case 'ArrowLeft':
            keys.aLeft.pressed = true
            enemy.lk = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.aRight.pressed = true
            enemy.lk = 'ArrowRight'
            break
        case 'ArrowDown' :
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    //player controls
    switch(event.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
    //enemy controls
    switch(event.key){
        case 'ArrowUp':
            keys.aUp.pressed = false
            break
        case 'ArrowLeft':
            keys.aLeft.pressed = false
            break
        case 'ArrowRight':
            keys.aRight.pressed = false
            break
    }
})