    // Typing effect for the specialty line
    const text = "data analyst → cloud & analytics engineer";
    const el = document.getElementById('specialtyText');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      el.textContent = text;
    } else {
      let i = 0;
      const startDelay = 1300; // starts after name reveal settles
      setTimeout(function typeChar() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(typeChar, 38);
        }
      }, startDelay);
    }

    // Ambient rising particles — nod to data moving up through
    // bronze → silver → gold pipeline layers
    if (!reduceMotion) {
      const colors = ['#e8b54a', '#9aa5b1', '#a8703f', '#4fd1c5'];
      const field = document.getElementById('particles');
      const count = 22;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (10 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        p.style.opacity = 0.2 + Math.random() * 0.4;
        field.appendChild(p);
      }
    }