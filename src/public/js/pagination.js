// Espera a que el documento HTML esté completamente cargado
$(document).ready(function() {
  // Inicializa la tabla con el nombre de ID 'myTable' utilizando la biblioteca DataTables
  $('#myTable').DataTable({
      // Configuración del idioma y mensajes personalizados para la tabla
      language: {
          "sProcessing": "Procesando...",  // Mensaje mostrado durante el procesamiento de la tabla
          "sLengthMenu": "Mostrar _MENU_ registros por página",  // Menú para seleccionar la cantidad de registros por página
          "sZeroRecords": "No se encontraron resultados",  // Mensaje mostrado cuando no hay resultados
          "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",  // Información sobre la cantidad de registros mostrados
          "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",  // Mensaje cuando no hay registros para mostrar
          "sInfoFiltered": "(filtrado de _MAX_ registros en total)",  // Información sobre registros filtrados
          "sInfoPostFix": "",
          "sSearch": "Buscar:",  // Etiqueta del campo de búsqueda
          "sUrl": "",
          "sInfoThousands": ",",  // Separador de miles en la información de registros
          "sLoadingRecords": "Cargando...",  // Mensaje mostrado durante la carga de registros
          "oPaginate": {
              "sFirst": "Primero",  // Etiqueta del botón para ir a la primera página
              "sLast": "Último",  // Etiqueta del botón para ir a la última página
              "sNext": "Siguiente",  // Etiqueta del botón para ir a la siguiente página
              "sPrevious": "Anterior"  // Etiqueta del botón para ir a la página anterior
          },
          "oAria": {
              "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
              "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          }
      }
  });
});
