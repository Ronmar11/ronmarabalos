const toggle = document.getElementById("darkToggle");
const facebook = document.getElementById('facebook-link');
const github = document.getElementById('github-link');
const meal = document.getElementById('mealmaster-link');
const bms = document.getElementById('bms-link');
const pra = document.getElementById('pra-link');

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
});