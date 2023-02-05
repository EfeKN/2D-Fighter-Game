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

const gravity = 0.15
class Sprite
{
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y

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
}

const player = new Sprite({
    position:{x:0, y:0},
    velocity:{x:0, y:0}
    })
player.draw()

const enemy = new Sprite({
    position:{x:974, y:0},
    velocity:{x:0, y:0}
    })
enemy.draw()

console.log(player)

//Animation Loop
function animate() {
    window.requestAnimationFrame(animate) // ---> infinite loop
    c.clearRect(0,0,canv.width,canv.height)
    c.fillStyle = 'black'
    c.fillRect(0,0,canv.width,canv.height)
    c.fillStyle = 'red'
    player.update()
    enemy.update()
}

animate()