    (function(){
      var canvas=document.getElementById('star-canvas');
      if(typeof THREE==='undefined'){return;} // offline fallback: nebulae + gradient bg still show

      var isSmall = window.innerWidth < 700;
      var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:false});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050300);
      scene.fog = new THREE.FogExp2(0x050300, 0.0012);

      var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 3000);
      camera.position.set(0,0,80);

      // Soft warm glow sprite for each star point
      var tc=document.createElement('canvas'); tc.width=tc.height=32;
      var tctx=tc.getContext('2d');
      var grad=tctx.createRadialGradient(16,16,0,16,16,16);
      grad.addColorStop(0,'rgba(255,255,255,1)');
      grad.addColorStop(0.4,'rgba(255,238,196,0.75)');
      grad.addColorStop(1,'rgba(255,238,196,0)');
      tctx.fillStyle=grad; tctx.fillRect(0,0,32,32);
      var starTex=new THREE.CanvasTexture(tc);

      // Elegant, mostly white/gold palette — matches the letter page's galaxy
      var palette=[
        new THREE.Color(0xffffff),
        new THREE.Color(0xfff5e6),
        new THREE.Color(0xffe9a6),
        new THREE.Color(0xe6f0ff),
        new THREE.Color(0xffd34d)
      ];

      var N = isSmall ? 1800 : 4200;
      var geo = new THREE.BufferGeometry();
      var pos = new Float32Array(N*3);
      var col = new Float32Array(N*3);
      var maxR = 900;
      for(var i=0;i<N;i++){
        var i3=i*3;
        var u=Math.random(), v=Math.random();
        var theta=u*2*Math.PI;
        var phi=Math.acos(2*v-1);
        var r=Math.cbrt(Math.random())*maxR;
        pos[i3]=r*Math.sin(phi)*Math.cos(theta);
        pos[i3+1]=r*Math.sin(phi)*Math.sin(theta);
        pos[i3+2]=r*Math.cos(phi)-200;
        var c=palette[Math.floor(Math.random()*palette.length)];
        var b=0.5+Math.random()*0.5;
        col[i3]=c.r*b; col[i3+1]=c.g*b; col[i3+2]=c.b*b;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
      geo.setAttribute('color', new THREE.BufferAttribute(col,3));

      var mat = new THREE.PointsMaterial({
        size:3.2,
        vertexColors:true,
        sizeAttenuation:true,
        transparent:true,
        opacity:0.85,
        map:starTex,
        depthWrite:false,
        blending:THREE.AdditiveBlending
      });

      var stars = new THREE.Points(geo, mat);
      scene.add(stars);

      function resize(){
        var w=window.innerWidth, h=window.innerHeight;
        camera.aspect=w/h;
        camera.updateProjectionMatrix();
        renderer.setSize(w,h);
      }
      window.addEventListener('resize', resize);

      var clock=new THREE.Clock();
      function animate(){
        var dt=clock.getDelta();
        stars.rotation.y += dt*0.012;
        stars.rotation.x += dt*0.004;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    })();

    var photos=[
      'img/cumpleanos/foto1.jpeg',
      'img/cumpleanos/foto2.jpeg',
      'img/cumpleanos/foto3.jpeg',
      'img/cumpleanos/foto4.jpeg',
      'img/cumpleanos/foto5.jpeg',
      'img/cumpleanos/foto6.jpeg'
    ];
    var currentIdx=0;
    var lb=document.getElementById('lightbox');
    var lbImg=document.getElementById('lb-img');
    function openLightbox(idx){currentIdx=idx;lbImg.src=photos[idx];lb.classList.add('open');document.body.style.overflow='hidden'}
    function closeLightbox(){lb.classList.remove('open');document.body.style.overflow=''}
    function showNext(){currentIdx=(currentIdx+1)%photos.length;lbImg.src=photos[currentIdx]}
    function showPrev(){currentIdx=(currentIdx-1+photos.length)%photos.length;lbImg.src=photos[currentIdx]}
    document.querySelectorAll('.photo-card').forEach(function(card){card.addEventListener('click',function(){openLightbox(+card.dataset.idx)})});
    document.getElementById('lb-close').addEventListener('click',closeLightbox);
    document.getElementById('lb-next').addEventListener('click',showNext);
    document.getElementById('lb-prev').addEventListener('click',showPrev);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLightbox()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')showNext();if(e.key==='ArrowLeft')showPrev()});

    // Touch swipe support for lightbox
    var touchStartX=0;
    lb.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){
      var dx=e.changedTouches[0].clientX-touchStartX;
      if(Math.abs(dx)>50){if(dx<0)showNext();else showPrev();}
    });
    var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target)}})},{threshold:0.1});
    document.querySelectorAll('.photo-card').forEach(function(card,i){card.style.opacity='0';card.style.transform='translateY(32px)';card.style.transition='opacity .7s ease '+(i*0.1)+'s, transform .7s cubic-bezier(.16,.9,.3,1) '+(i*0.1)+'s, box-shadow .35s, border-color .35s';io.observe(card)});

    // Intro Sequence Logic
    (function(){
      var msgs = document.querySelectorAll('.intro-msg');
      var overlay = document.getElementById('intro-sequence');
      var current = 0;
      
      // Prevent scrolling while intro is playing
      document.body.style.overflow = 'hidden';

      function showNext() {
        if (current > 0) {
          msgs[current - 1].classList.remove('show');
        }
        if (current < msgs.length) {
          setTimeout(function() {
            msgs[current].classList.add('show');
            current++;
            setTimeout(showNext, 4000); // Time to read the message
          }, 1500); // Fade out transition gap
        } else {
          setTimeout(function() {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
          }, 1000);
        }
      }

      document.getElementById('btn-ready-no').addEventListener('click', function() {
        document.getElementById('ready-text').innerText = 'Tranquila, presiona en sí cuando estés lista ✨';
      });

      document.getElementById('btn-ready-yes').addEventListener('click', function() {
        document.getElementById('ready-prompt').classList.add('hidden');
        
        // Start music on user interaction
        var audio = document.getElementById('bg-audio');
        if (audio && audio.paused) {
          if (audio.currentTime < 33) audio.currentTime = 33;
          audio.volume = 0.35;
          audio.play().catch(function(){});
          
          // Update ctrl UI if it exists
          var ctrl = document.getElementById('music-ctrl');
          if (ctrl) ctrl.classList.remove('muted');
        }

        setTimeout(showNext, 800);
      });
    })();

    (function(){
      var audio = document.getElementById('bg-audio');
      var ctrl = document.getElementById('music-ctrl');
      var isMuted = false;
      
      // Mostrar el control inmediatamente
      ctrl.classList.add('show');
      
      // Intentar reproducir automáticamente saltando a la mejor parte (ej. 33 segundos)
      audio.volume = 0.35;
      
      function attemptPlay() {
        audio.currentTime = 33; // Salta directo a la parte más alegre/movida
        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(function(error) {
            // Si el navegador bloquea el autoplay, lo mostramos como silenciado
            isMuted = true;
            ctrl.classList.add('muted');
          });
        }
      }

      if (audio.readyState >= 1) {
        attemptPlay();
      } else {
        audio.addEventListener('loadedmetadata', attemptPlay);
      }

      ctrl.addEventListener('click', function(e) {
        e.stopPropagation(); // Evitar que el click se propague a otros elementos
        
        if (audio.paused) {
          // Si estaba pausado (por bloqueo de autoplay), lo reproducimos
          if (audio.currentTime < 33) audio.currentTime = 33;
          audio.volume = 0.35;
          audio.play();
          isMuted = false;
          ctrl.classList.remove('muted');
          return;
        }

        // Toggle mute con fade
        isMuted = !isMuted;
        ctrl.classList.toggle('muted', isMuted);
        
        var start = audio.volume;
        var end = isMuted ? 0 : 0.35;
        var steps = 20;
        var step = 0;
        
        var iv = setInterval(function(){
          step++;
          audio.volume = start + (end - start) * (step / steps);
          if (step >= steps) {
            clearInterval(iv);
            audio.volume = end;
            if (isMuted) audio.pause();
          }
        }, 20);
      });
    })();
