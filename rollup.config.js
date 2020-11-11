import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
    input: './src/index.ts',
    output: {
        file: 'bundle.cjs.js',
        format: 'cjs',
        name: 'bundleName',
        sourcemap: true
    },
    plugins: [
        typescript({
            exclude: "node_modules/**",
            typescript: require("typescript")
        }),
        sourceMaps()
    ],
}