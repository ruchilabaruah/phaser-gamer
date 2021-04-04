/**
Initialize the phaser game object. First line is the size of the window.
**/

import Phaser from "phaser";
import sky from "./assets/sky.png";
import platform from "./assets/platform.png";
import diamond from "./assets/diamond.png";
import woof from "./assets/woof.png"

        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        var game = new Phaser.Game(config);

        function preload () {
          /** Assets are being cooked in backend **/
            this.load.image('sky', sky);
            this.load.image('ground', platform);
            this.load.image('diamond', diamond);
            this.load.spritesheet('dude',
              woof,
              { frameWidth: 32, frameHeight: 32 }
          );
        }

        var platforms;
        var player;
        var cursors;
        var stars;
        var score = 0;
        var scoreText;

        function create () {
          this.add.image(400, 300, 'sky');

            /** Since this game is a platform, we need to add platforms. We organise them by adding groups **/
            /** First platform is the ground. Scale it in a way that it occupies the entire bottom of the screen **/
           platforms = this.physics.add.staticGroup(); //creating static physics group

           /** setScale(2) makes 400 * 32 = 800 * 64
           When we scale a static body, we have to refresh it to let the physics world know
           **/
           platforms.create(400, 568, 'ground').setScale(2).refreshBody();
           platforms.create(600, 400, 'ground');
           platforms.create(50, 250, 'ground');
           platforms.create(750, 220, 'ground');

            player = this.physics.add.sprite(32, 450, 'dude');

            player.setBounce(0.2);
            player.setCollideWorldBounds(true);

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'stop',
                frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 2 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.physics.add.collider(player, platforms);
            cursors = this.input.keyboard.createCursorKeys();

            stars = this.physics.add.group({
                key: 'diamond',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 }
            });

            stars.children.iterate(function (child) {

                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

            });
            this.physics.add.collider(stars, platforms);
            this.physics.add.overlap(player, stars, collectStar, null, this);

            scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        }

        function update() {
          if (cursors.left.isDown) {
              player.setVelocityX(-160);

              player.anims.play('left', true);
          }
          else if (cursors.right.isDown) {
              player.setVelocityX(160);

              player.anims.play('right', true);
          }
          else {
              player.setVelocityX(0);

              player.anims.play('stop', true);
          }

          if (cursors.up.isDown && player.body.touching.down) {
              player.setVelocityY(-330);
          }
        }

        function collectStar (player, star) {
            star.disableBody(true, true);

            score += 10;
            scoreText.setText('Score: ' + score);

            if (score == 120) {
              scoreText.setText('You won!!');
              score = 0;
            }
        }
