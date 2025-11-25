const toggle = document.getElementById('darkToggle');
const stored = localStorage.getItem('dark-mode');
const facebook = document.getElementById('facebook-link');
const github = document.getElementById('github-link');
const portfolio = document.getElementById('porfolio-link');
const meal = document.getElementById('mealmaster-link');
const bms = document.getElementById('bms-link');
const bmsyt = document.getElementById('bms-yt-link');
const pra = document.getElementById('pra-link');
const prayt = document.getElementById('pra-yt-link');
const linkedid = document.getElementById('linkedid-link');
const github2 = document.getElementById('github-link2');
const instagram = document.getElementById('instagram-link');
const email = document.getElementById('email-link');



(function setupDarkToggle(){

  function init(){
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored === '1' ? true : (stored === '0' ? false : prefersDark);
    if (initialDark) document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = initialDark;

    if (!toggle) return;
    toggle.addEventListener('change', () => {
      const on = !!toggle.checked;
      document.body.classList.toggle('dark-mode', on);
      localStorage.setItem('dark-mode', on ? '1' : '0');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.addEventListener('DOMContentLoaded', function() {
    if (facebook) {
        facebook.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            
            if (url) {
                window.open(url); 
            }
        });
    }
    if(github){
      github.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(portfolio){
      portfolio.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(meal){
      meal.addEventListener('click', function(){
        const url = this.getAttribute('data-url');

        if(url){
          window.open(url);
        }
      });
    }
    if(bms){
      bms.addEventListener('click', function(){
        const url = this.getAttribute('data-url');

        if(url){
          window.open(url);
        }
      });
    }
    if(bmsyt){
      bmsyt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
      }
    
    if(pra){
      pra.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(pra){
          window.open(url);
        }
      });
    }
    if(prayt){
      prayt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(linkedid){
      linkedid.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(linkedid){
          window.open(url);
        }
      });
    }
    if(github2){
      github2.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(instagram){
      instagram.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(instagram){
          window.open(url);
        }
      });
    }
    if(email){
      email.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(email){
           window.open(`mailto:${url}`)
        }
      });
    }
});

document.addEventListener("DOMContentLoaded", () => {

  const clickable = document.querySelectorAll(
    ".menu li a, .img, .button1, .project-divider, .proj-logo-divider-size, .tech-stack, .contact-icon, .contact-email, .button"
  );

  clickable.forEach(el => {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");
    });
  });
});
