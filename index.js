// 1:12:24

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

const gravity = 0.7
const speed = 5
const hop = 20
const cooldown = 1000

class Sprite
{
    constructor({position, velocity,color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lk // = last_key
        this.attackBox = {
            position: {
                x: this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)

        //attack box
        if(this.isAttacking)
        {
        c.fillStyle = 'blue'
        c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        }
        c.fillStyle = 'green'
    }

    update() {
        this.draw()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        //movement
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        //check y-bounds
        if(this.position.y + this.height + this.velocity.y >= canv.height)
        {
            this.velocity.y = 0
        }
        else
        {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, cooldown)
    }
}

const player = new Sprite({
    position:{x:0, y:0},
    velocity:{x:0, y:0},
    offset: {x:0,y:0}
    })
player.draw()

const enemy = new Sprite({
    position:{x:974, y:0},
    velocity:{x:0, y:0},
    color:'yellow',
    offset: {x:-50,y:0}
    })
enemy.draw()

console.log(player)

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

//Animation Loop
function animate() {
    window.requestAnimationFrame(animate) // ---> infinite loop
    c.clearRect(0,0,canv.width,canv.height)
    c.fillStyle = 'black'
    c.fillRect(0,0,canv.width,canv.height)
    c.fillStyle = 'red'
    player.update()
    enemy.update()

    //Player Movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lk == 'a') {
        player.velocity.x = -1 * speed
    }
    else if(keys.d.pressed && player.lk == 'd') {
        player.velocity.x = speed
    }

    //Enemy Movement
    enemy.velocity.x = 0
    if(keys.aLeft.pressed && enemy.lk == 'ArrowLeft') {
        enemy.velocity.x = -1 * speed
    }
    else if(keys.aRight.pressed && enemy.lk == 'ArrowRight') {
        enemy.velocity.x = speed
    }

    //collusion detection
    if (checkCollusion({rect1:player,rect2:enemy}) && player.isAttacking)
    {
        player.isAttacking = false
        console.log('player_attacking')
    }

    if (checkCollusion({rect1:enemy,rect2:player}) && enemy.isAttacking)
    {
        enemy.isAttacking = false
        console.log('enemy_attacking')
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
            enemy.isAttacking = true
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