import path from 'path'

export default {
    mode: 'development',
    entry:{
        map: './src/libs/map.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./src/public/js')
    }
}