let move_speed = 4, grativy = 0.6;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sonidos/point.mp3');
let sound_die = new Audio('sonidos/die.mp3');
let sound_fondo = new Audio('sonidos/happy pluck1.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background-video').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let score = 0; 

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Puntos : ';
        score_val.innerHTML = '0';
        score = 0; 
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    function move() {
        if (game_state != 'Play') return;
        sound_fondo.play();

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top) {

                    game_state = 'End';
                    message.innerHTML = '<span style="color:red;">Game Over</span><br>Presiona enter para jugar';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    if (pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score == '1') {

                        score++; 
                        score_val.innerHTML = score; 
                        sound_point.play();
                    }
                    
                   
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';

                    // Movimiento oscilante hacia arriba y abajo
                    if (score >= 3) { 
                        let oscillationSpeed = 0.9 ; // Velocidad del movimiento oscilante
                        let newTopPosition = parseFloat(pipe_sprite_props.top) + Math.sin(Date.now() / 1000) * oscillationSpeed;
                        element.style.top = newTopPosition + 'px'; 
                    }
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;

        bird_dy += grativy;

        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'imagenes/Bird-2.png';
                bird_dy = -7.6; // Ajusta la velocidad de salto
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'imagenes/Bird.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh'; 
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh'; 
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(create_pipe);
}


const textContainer = document.createElement('div');
textContainer.id = 'floating-text';
document.body.appendChild(textContainer);

const text = "Flappy Bird";
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1'];

text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.color = colors[Math.floor(Math.random() * colors.length)];
    span.style.display = 'inline-block';
    span.style.transition = 'transform 0.2s ease-in-out';

    span.style.marginRight = '40px'; 
    span.style.fontWeight = 'bold'; 

    setInterval(() => {
        const floatAmount = Math.sin(Date.now() / 500 + index) * 10; 
        span.style.transform = `translateY(${floatAmount}px)`;
    }, 50);

    textContainer.appendChild(span);
});