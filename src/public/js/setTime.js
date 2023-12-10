    setTimeout(() => {
        const mensaje = document.getElementById("message");
        if (mensaje) {
            mensaje.style.display = 'none';
        }
    }, 4000); 

    
    document.addEventListener('DOMContentLoaded', function () {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const welcomeMessage = document.getElementById('msg');
    
        // Función para verificar el ancho de la ventana y ocultar/mostrar el mensaje
        function toggleWelcomeMessage() {
            if (window.innerWidth <= 640) {
                welcomeMessage.style.display = 'none';
            } else {

            }
        }
    
        // Verificar y ocultar el mensaje al cargar la página
        toggleWelcomeMessage();
    
        // Evento de cambio de tamaño de ventana para ajustar dinámicamente la visibilidad del mensaje
        window.addEventListener('resize', toggleWelcomeMessage);
    
        // Toggle del menú móvil
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    
        // Restaura la visibilidad del mensaje cuando se cierra el menú móvil
        mobileMenu.addEventListener('transitionend', function () {
            if (window.innerWidth <= 640 && mobileMenu.classList.contains('hidden')) {
                welcomeMessage.style.display = 'block';
            }
        });
    });
    