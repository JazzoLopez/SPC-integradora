
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mainMenu = document.getElementById('main-menu');
  
    mobileMenuButton.addEventListener('click', function () {
        console.log('Clic en el botón de hamburguesa');
      mainMenu.classList.toggle('hidden');
    });
  });
  