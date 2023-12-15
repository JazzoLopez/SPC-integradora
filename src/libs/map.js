(function () {
    // Coordenadas iniciales para el centro del mapa
    const lat = 20.265807663544592;
    const lng = -97.96311110164913;

    // Creación de un mapa Leaflet y configuración de la vista
    const map = L.map('map').setView([lat, lng], 22);

    // Creación de un icono personalizado para el marcador
    var greenIcon = L.icon({
        iconUrl: "assets/Grupo 1.jpg",
        iconSize: [55, 55], // tamaño del ícono
        popupAnchor: [-3, -76] // punto desde el cual se abrirá el popup en relación con el iconAnchor
    });

    let marker; // Variable para almacenar el marcador

    // Servicio de geocodificación proporcionado por la biblioteca Leaflet para obtener información de direcciones
    const geocoderService = L.esri.Geocoding.geocodeService();

    // Capa de azulejos (tile layer) de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Creación de un marcador inicial en las coordenadas especificadas
    marker = new L.marker([lat, lng], {
        draggable: true, // Puedes mover el marcador
        autoPan: true,
        icon: greenIcon,
    }).addTo(map);

    // Evento 'moveend' para el marcador (se dispara cuando se termina de mover)
    marker.on('moveend', function (e) {
        marker = e.target; // Actualiza la variable del marcador
        const position = marker.getLatLng(); // Obtiene las nuevas coordenadas del marcador

        map.panTo(new L.LatLng(position.lat, position.lng)); // Centra el mapa en las nuevas coordenadas

        // Obtener información de dirección física utilizando el servicio de geocodificación
        geocoderService.reverse().latlng(position, 13).run(function (error, result) {
            marker.bindPopup(result.address.LongLabel); // Muestra la dirección en un popup del marcador
        });
    });
})();