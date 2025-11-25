const toggle = document.getElementById("darkToggle");
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
  document.querySelectorAll(".menu li a, .img, .button1, .project-divider, .proj-logo-divider-size, .tech-stack, .contact-icon, .contact-email, .button").forEach(el => {
    el.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });
});
