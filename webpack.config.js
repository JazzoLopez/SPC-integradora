// Importación del módulo 'path'
import path from 'path';

// Configuración de Webpack
export default {
    // Modo de ejecución, en este caso, desarrollo
    mode: 'development',
    
    // Configuración de entrada: especifica los archivos de entrada y sus nombres lógicos
    entry: {
        map: './src/libs/map.js'
    },
    
    // Configuración de salida: especifica la ubicación y el nombre de los archivos de salida generados
    output: {
        filename: '[name].js',  // El nombre del archivo de salida será el mismo que el nombre lógico de la entrada
        path: path.resolve('./src/public/js')  // La ubicación donde se guardarán los archivos de salida
    }
};
