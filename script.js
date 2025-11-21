const toggle = document.getElementById("darkToggle");
const facebook = document.getElementById('facebook-link');
const github = document.getElementById('github-link');
const porfolio = document.getElementById('porfolio-link');
const meal = document.getElementById('mealmaster-link');
const bms = document.getElementById('bms-link');
const pra = document.getElementById('pra-link');
const linkedid = document.getElementById('linkedid-link');
const github2 = document.getElementById('github-link2');
const instagram = document.getElementById('instagram-link');
const email = document.getElementById('email-link');
const bars = document.querySelector('.bars');
const menu = document.querySelector('.menu');
const bmsyt = document.getElementById('bms-yt-link');
const prayt = document.getElementById('pra-yt-link');


toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", toggle.checked);
});

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
    if(porfolio){
      porfolio.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(porfolio){
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
    if(pra){
      pra.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(pra){
          window.open(url);
        }
      });
    }
        if(bmsyt){
      bmsyt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(bmsyt){
          window.open(url);
        }
      });
    }
    if(prayt){
      prayt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(prayt){
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
    if (bars && menu) {
      bars.addEventListener('click', function() {
        menu.classList.toggle('active');
      });
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          menu.classList.remove('active');
        });
      });
    }
});