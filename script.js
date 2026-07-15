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





//     // Visitor counter — calls Azure Function API to get/increment count
// async function updateVisitorCount() {
//   const countEl = document.getElementById('visitor-count');
//   if (!countEl) return;

//   try {
//     const response = await fetch('https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/GetResumeCounter');
//     if (!response.ok) throw new Error('Network response was not ok');
//     const data = await response.json();
//     countEl.textContent = data.count;
//   } catch (error) {
//     console.error('Failed to fetch visitor count:', error);
//     countEl.textContent = 'N/A';
//   }
// }

// updateVisitorCount();



// Visitor counter — calls Azure Function API to get/increment count
// async function updateVisitorCount() {
//   const countEl = document.getElementById('visitor-count');
//   if (!countEl) return;

//   try {
//     // Updated to target your local running function route
//     const response = await fetch('http://localhost:7071/api/counter');
//     if (!response.ok) throw new Error('Network response was not ok');
//     const data = await response.json();
    
//     // Check your backend API's response key. 
//     // If your backend returns an object like { count: 5 }, this works perfectly.
//     countEl.textContent = data.count; 
//   } catch (error) {
//     console.error('Failed to fetch visitor count:', error);
//     countEl.textContent = 'N/A';
//   }
// }

// updateVisitorCount();



fetch('https://resume-visitor-count-e2abe4gscvf4gce8.uaenorth-01.azurewebsites.net/api/counter')
  .then(response => response.json())
  .then(data => {
    document.getElementById('visitor-count').textContent = data.count;
  })
  .catch(error => {
    console.error('Could not load visitor count:', error);
    document.getElementById('visitor-count').textContent = '—';
  });