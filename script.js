// ==========================================================================
// PROYECTO VIDEOJUEGO PHASER - SPACE SHOOTER
// Estudiante: Andre Alvarado Lira
// Niveles: Portada, Nivel 1 (Nivel 2 en desarrollo preliminar)
// ==========================================================================

// Configuración principal del juego (370 x 900 CANVAS)
var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');

// Variables globales de audio sintetizado Web Audio API
var audioCtx = null;
function iniciarAudio() {
  if (!audioCtx) {
    try {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio no disponible:', e);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Efecto de sonido: Disparo Láser Retro
function reproducirSonidoDisparo() {
  iniciarAudio();
  if (!audioCtx) return;
  try {
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (err) {}
}

// Efecto de sonido: Explosión Retro
function reproducirSonidoExplosion() {
  iniciarAudio();
  if (!audioCtx) return;
  try {
    var now = audioCtx.currentTime;
    var bufferSize = audioCtx.sampleRate * 0.25;
    var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    var noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(100, now + 0.25);
    var gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
  } catch (err) {}
}

// ==========================================================================
// ESTADO 1: PORTADA / MENÚ DE INICIO
// ==========================================================================
var estadoPortada = {
  preload: function() {
    juego.load.image('fondo', 'assets/img/fondo.png');
    juego.load.image('nave', 'assets/img/nave.png');
    juego.load.image('enemigo', 'assets/img/enemigo.png');
  },

  create: function() {
    // Fondo estrellado
    this.fondo = juego.add.tileSprite(0, 0, 370, 900, 'fondo');

    // Título Principal
    var titulo = juego.add.text(185, 140, 'SPACE\nDEFENDER', {
      font: 'bold 36px Arial',
      fill: '#4df0ff',
      align: 'center',
      stroke: '#081c3a',
      strokeThickness: 6
    });
    titulo.anchor.setTo(0.5);

    // Decoración: Nave y Enemigo en portada
    var naveDecor = juego.add.sprite(185, 330, 'nave');
    naveDecor.anchor.setTo(0.5);
    naveDecor.scale.setTo(1.4);
    juego.add.tween(naveDecor).to({ y: 350 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

    var enemigoDecor1 = juego.add.sprite(90, 240, 'enemigo');
    enemigoDecor1.anchor.setTo(0.5);
    var enemigoDecor2 = juego.add.sprite(280, 240, 'enemigo');
    enemigoDecor2.anchor.setTo(0.5);
    juego.add.tween(enemigoDecor1).to({ y: 220 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    juego.add.tween(enemigoDecor2).to({ y: 220 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 100, -1, true);

    // Datos del Alumno requeridos
    var autorTitulo = juego.add.text(185, 470, 'ESTUDIANTE:', {
      font: '14px Arial',
      fill: '#94a3b8',
      align: 'center'
    });
    autorTitulo.anchor.setTo(0.5);

    var autorNombre = juego.add.text(185, 500, 'Andre Alvarado Lira', {
      font: 'bold 22px Arial',
      fill: '#ffd166',
      align: 'center',
      stroke: '#3b2500',
      strokeThickness: 4
    });
    autorNombre.anchor.setTo(0.5);

    // Mensaje de inicio parpadeante
    var pressStart = juego.add.text(185, 660, 'PRESIONA [ESPACIO]\nPARA JUGAR NIVEL 1', {
      font: 'bold 18px Arial',
      fill: '#06d6a0',
      align: 'center'
    });
    pressStart.anchor.setTo(0.5);
    juego.add.tween(pressStart).to({ alpha: 0.2 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);

    // Información de controles
    var info = juego.add.text(185, 820, 'Flechas: Mover | Espacio: Disparar', {
      font: '13px Arial',
      fill: '#94a3b8',
      align: 'center'
    });
    info.anchor.setTo(0.5);

    // Tecla de inicio
    this.teclaEspacio = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.teclaEnter = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  },

  update: function() {
    this.fondo.tilePosition.y += 1;
    if (this.teclaEspacio.isDown || this.teclaEnter.isDown) {
      iniciarAudio();
      juego.state.start('nivel1');
    }
  }
};

// ==========================================================================
// ESTADO 2: NIVEL 1 (ELIMINACIÓN DE ENEMIGOS, DISPAROS Y COLISIONES)
// ==========================================================================
var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var botonDisparo;
var enemigos;
var balas;
var tiempoBala = 0;
var puntaje = 0;
var textoPuntaje;
var textoNivel;
var explosiones;

var estadoNivel1 = {
  preload: function() {
    juego.load.image('fondo', 'assets/img/fondo.png');
    juego.load.image('nave', 'assets/img/nave.png');
    juego.load.image('enemigo', 'assets/img/enemigo.png');
    juego.load.image('laser', 'assets/img/laser.png');
    juego.load.spritesheet('explosion', 'assets/img/explosion.png', 32, 32);
  },

  create: function() {
    // 1. Fondo con desplazamiento continuo
    fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');

    // 2. Sistema de física Arcade
    juego.physics.startSystem(Phaser.Physics.ARCADE);

    // 3. Jugador (Nave)
    personaje = juego.add.sprite(185, 800, 'nave');
    personaje.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(personaje);
    personaje.body.collideWorldBounds = true;

    // 4. Grupo de Balas (Disparos láser)
    balas = juego.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(30, 'laser');
    balas.setAll('anchor.x', 0.5);
    balas.setAll('anchor.y', 1);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds', true);

    // 5. Grupo de Enemigos en formación (según imagen de referencia)
    enemigos = juego.add.group();
    enemigos.enableBody = true;
    enemigos.physicsBodyType = Phaser.Physics.ARCADE;

    for (var fila = 0; fila < 3; fila++) {
      for (var col = 0; col < 3; col++) {
        var enemigo = enemigos.create(col * 60, fila * 55, 'enemigo');
        enemigo.anchor.setTo(0.5, 0.5);
      }
    }
    enemigos.x = 80;
    enemigos.y = 120;

    // Animación de vaivén de la formación de enemigos
    var tweenEnemigos = juego.add.tween(enemigos).to(
      { x: 170 },
      1200,
      Phaser.Easing.Sinusoidal.InOut,
      true,
      0,
      -1,
      true
    );

    // 6. Grupo de Explosiones animadas
    explosiones = juego.add.group();
    for (var i = 0; i < 20; i++) {
      var exp = explosiones.create(0, 0, 'explosion');
      exp.anchor.setTo(0.5, 0.5);
      exp.animations.add('boom', [0, 1, 2, 3, 4], 18, false);
      exp.kill();
    }

    // 7. Controles de Teclado
    teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    teclaArriba = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    teclaAbajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // 8. Marcadores en Pantalla (HUD)
    puntaje = 0;
    textoNivel = juego.add.text(16, 16, 'NIVEL 1', {
      font: 'bold 16px Arial',
      fill: '#4df0ff'
    });
    textoPuntaje = juego.add.text(16, 40, 'PUNTOS: 0', {
      font: 'bold 15px Arial',
      fill: '#ffd166'
    });
  },

  update: function() {
    // Movimiento del fondo (scroll espacial)
    fondoJuego.tilePosition.y += 2;

    // Movimiento suave del jugador
    var velocidad = 4;
    if (teclaDerecha.isDown) {
      personaje.x += velocidad;
    } else if (teclaIzquierda.isDown) {
      personaje.x -= velocidad;
    }

    if (teclaArriba.isDown && personaje.y > 450) {
      personaje.y -= velocidad;
    } else if (teclaAbajo.isDown && personaje.y < 850) {
      personaje.y += velocidad;
    }

    // Disparo con botón espacio y cadencia
    if (botonDisparo.isDown) {
      if (juego.time.now > tiempoBala) {
        var bala = balas.getFirstExists(false);
        if (bala) {
          bala.reset(personaje.x, personaje.y - 20);
          bala.body.velocity.y = -500;
          tiempoBala = juego.time.now + 180;
          reproducirSonidoDisparo();
        }
      }
    }

    // Detección de colisiones (bala vs enemigo)
    juego.physics.arcade.overlap(balas, enemigos, colisionBalaEnemigo, null, this);

    // Verificar si se eliminaron todos los enemigos
    if (enemigos.countLiving() === 0 && !this.nivelGanado) {
      this.nivelGanado = true;
      var cartelVictoria = juego.add.text(185, 450, '¡NIVEL 1 SUPERADO!\n\nPresiona [ENTER] o [ESPACIO]\npara iniciar Nivel 2', {
        font: 'bold 20px Arial',
        fill: '#06d6a0',
        align: 'center',
        stroke: '#002015',
        strokeThickness: 5
      });
      cartelVictoria.anchor.setTo(0.5);

      var enterKey = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      var spaceKey = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      var avanzar = function() {
        juego.state.start('nivel2');
      };
      enterKey.onDown.addOnce(avanzar, this);
      spaceKey.onDown.addOnce(avanzar, this);
    }
  }
};

// Función de Colisión entre Bala y Enemigo Nivel 1
function colisionBalaEnemigo(bala, enemigo) {
  bala.kill();
  enemigo.kill();

  // Sonido de explosión
  reproducirSonidoExplosion();

  // Animación visual de explosión
  var exp = explosiones.getFirstExists(false);
  if (exp) {
    exp.reset(enemigo.x, enemigo.y);
    exp.play('boom', 18, false, true);
  }

  // Aumentar puntaje
  puntaje += 100;
  textoPuntaje.text = 'PUNTOS: ' + puntaje;
}

// ==========================================================================
// ESTADO 3: NIVEL 2 (AMENAZA ELITE, ENEMIGOS AVANZADOS Y DESCENSO)
// ==========================================================================
var fondoJuego2;
var personaje2;
var balas2;
var enemigos2;
var explosiones2;
var tiempoBala2 = 0;
var textoNivel2;
var textoPuntaje2;
var textoRestantes2;
var teclaDerecha2;
var teclaIzquierda2;
var teclaArriba2;
var teclaAbajo2;
var botonDisparo2;

var estadoNivel2 = {
  preload: function() {
    juego.load.image('fondo', 'assets/img/fondo.png');
    juego.load.image('nave', 'assets/img/nave.png');
    juego.load.image('enemigo', 'assets/img/enemigo.png');
    juego.load.image('enemigo2', 'assets/img/enemigo2.png');
    juego.load.image('laser', 'assets/img/laser.png');
    juego.load.spritesheet('explosion', 'assets/img/explosion.png', 32, 32);
  },

  create: function() {
    this.juegoTerminado = false;

    // 1. Fondo espacial con tinte rojizo/violeta de mayor alerta
    fondoJuego2 = juego.add.tileSprite(0, 0, 370, 900, 'fondo');
    fondoJuego2.tint = 0xffc4d6;

    // 2. Sistema de física Arcade
    juego.physics.startSystem(Phaser.Physics.ARCADE);

    // 3. Jugador (Nave)
    personaje2 = juego.add.sprite(185, 800, 'nave');
    personaje2.anchor.setTo(0.5, 0.5);
    juego.physics.arcade.enable(personaje2);
    personaje2.body.collideWorldBounds = true;

    // 4. Grupo de Balas
    balas2 = juego.add.group();
    balas2.enableBody = true;
    balas2.physicsBodyType = Phaser.Physics.ARCADE;
    balas2.createMultiple(35, 'laser');
    balas2.setAll('anchor.x', 0.5);
    balas2.setAll('anchor.y', 1);
    balas2.setAll('outOfBoundsKill', true);
    balas2.setAll('checkWorldBounds', true);

    // 5. Grupo de Enemigos Nivel 2 (Escuadrón Mixto: Élite + Estandar)
    enemigos2 = juego.add.group();
    enemigos2.enableBody = true;
    enemigos2.physicsBodyType = Phaser.Physics.ARCADE;

    // Fila 0: 3 Naves Élite (moradas/doradas)
    for (var c0 = 0; c0 < 3; c0++) {
      var elite = enemigos2.create(c0 * 70 + 35, 0, 'enemigo2');
      elite.anchor.setTo(0.5, 0.5);
      elite.puntos = 250;
      elite.tipo = 'elite';
    }

    // Filas 1 y 2: 8 Naves Estándar (4 por fila)
    for (var fila = 1; fila <= 2; fila++) {
      for (var col = 0; col < 4; col++) {
        var normal = enemigos2.create(col * 55, fila * 52, 'enemigo');
        normal.anchor.setTo(0.5, 0.5);
        normal.puntos = 150;
        normal.tipo = 'normal';
      }
    }

    enemigos2.x = 45;
    enemigos2.y = 110;

    // Movimiento oscilante más rápido con descenso en cada ciclo
    var tween2 = juego.add.tween(enemigos2).to(
      { x: 145 },
      850,
      Phaser.Easing.Sinusoidal.InOut,
      true,
      0,
      -1,
      true
    );

    // Descenso paulatino para aumentar la dificultad
    tween2.onLoop.add(function() {
      if (enemigos2 && enemigos2.y < 680) {
        enemigos2.y += 12;
      }
    }, this);

    // 6. Grupo de Explosiones
    explosiones2 = juego.add.group();
    for (var i = 0; i < 25; i++) {
      var exp = explosiones2.create(0, 0, 'explosion');
      exp.anchor.setTo(0.5, 0.5);
      exp.animations.add('boom', [0, 1, 2, 3, 4], 20, false);
      exp.kill();
    }

    // 7. Controles
    teclaDerecha2 = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    teclaIzquierda2 = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    teclaArriba2 = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    teclaAbajo2 = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    botonDisparo2 = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // 8. HUD Nivel 2
    textoNivel2 = juego.add.text(16, 16, 'NIVEL 2 - FLOTA ELITE', {
      font: 'bold 15px Arial',
      fill: '#ff5470'
    });

    textoPuntaje2 = juego.add.text(16, 38, 'PUNTOS: ' + puntaje, {
      font: 'bold 15px Arial',
      fill: '#ffd166'
    });

    textoRestantes2 = juego.add.text(230, 16, 'ENEMIGOS: ' + enemigos2.countLiving(), {
      font: 'bold 14px Arial',
      fill: '#ffffff'
    });
  },

  update: function() {
    if (this.juegoTerminado) return;

    // Fondo se desplaza más rápido en Nivel 2
    fondoJuego2.tilePosition.y += 3;

    // Movimiento del jugador
    var velocidad = 4.5;
    if (teclaDerecha2.isDown) {
      personaje2.x += velocidad;
    } else if (teclaIzquierda2.isDown) {
      personaje2.x -= velocidad;
    }

    if (teclaArriba2.isDown && personaje2.y > 450) {
      personaje2.y -= velocidad;
    } else if (teclaAbajo2.isDown && personaje2.y < 850) {
      personaje2.y += velocidad;
    }

    // Disparos
    if (botonDisparo2.isDown) {
      if (juego.time.now > tiempoBala2) {
        var bala = balas2.getFirstExists(false);
        if (bala) {
          bala.reset(personaje2.x, personaje2.y - 20);
          bala.body.velocity.y = -550;
          tiempoBala2 = juego.time.now + 160;
          reproducirSonidoDisparo();
        }
      }
    }

    // Colisiones balas vs enemigos
    juego.physics.arcade.overlap(balas2, enemigos2, colisionBalaEnemigoNivel2, null, this);

    // Colisión física o invasión si los enemigos bajan demasiado
    if (enemigos2.y > 680) {
      this.juegoTerminado = true;
      var txtPerdiste = juego.add.text(185, 450, '¡INVASIÓN EXITOSA!\n\nGAME OVER\n\nPresiona [R] para reiniciar', {
        font: 'bold 22px Arial',
        fill: '#ef4444',
        align: 'center',
        stroke: '#2b0505',
        strokeThickness: 5
      });
      txtPerdiste.anchor.setTo(0.5);

      var rKeyFail = juego.input.keyboard.addKey(Phaser.Keyboard.R);
      rKeyFail.onDown.addOnce(function() {
        puntaje = 0;
        juego.state.start('portada');
      }, this);
    }

    // Verificar Victoria de Nivel 2 (Juego Completo)
    if (enemigos2.countLiving() === 0 && !this.juegoTerminado) {
      this.juegoTerminado = true;
      var cartelVictoriaFinal = juego.add.text(185, 430, '¡MISIÓN CUMPLIDA!\n★ HAS SALVADO LA GALAXIA ★\n\nPUNTAJE FINAL: ' + puntaje + '\n\nPresiona [R] para reiniciar', {
        font: 'bold 19px Arial',
        fill: '#10b981',
        align: 'center',
        stroke: '#022415',
        strokeThickness: 5
      });
      cartelVictoriaFinal.anchor.setTo(0.5);

      var rKey = juego.input.keyboard.addKey(Phaser.Keyboard.R);
      rKey.onDown.addOnce(function() {
        puntaje = 0;
        juego.state.start('portada');
      }, this);
    }
  }
};

// Función de Colisión Nivel 2
function colisionBalaEnemigoNivel2(bala, enemigo) {
  bala.kill();
  enemigo.kill();

  reproducirSonidoExplosion();

  var exp = explosiones2.getFirstExists(false);
  if (exp) {
    exp.reset(enemigo.x, enemigo.y);
    exp.play('boom', 20, false, true);
  }

  puntaje += (enemigo.puntos || 150);
  textoPuntaje2.text = 'PUNTOS: ' + puntaje;
  textoRestantes2.text = 'ENEMIGOS: ' + enemigos2.countLiving();
}

// Registro de estados e inicio en la Portada
juego.state.add('portada', estadoPortada);
juego.state.add('nivel1', estadoNivel1);
juego.state.add('nivel2', estadoNivel2);
juego.state.start('portada');
