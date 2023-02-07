class Sprite
{
    constructor({position, imgSrc, scale = 1, frames = 1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.frames = frames
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 60
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent*(this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.frames)*this.scale,
            this.image.height*this.scale
        )
    }

    update() {
        this.draw()
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold == 0)
        {
            if(this.framesCurrent<this.frames - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

class Fighter
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
        this.health = hp
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
        if(this.position.y + this.height + this.velocity.y >= canv.height - 96)
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