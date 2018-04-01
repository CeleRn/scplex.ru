'use strict';

// Зависимости
const webpack = require("webpack");
const path = require('path');
const yml = require("require-yml");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');



// Окружение 
const NODE_ENV = process.env.NODE_ENV || 'developer';

const isProduction = (NODE_ENV == 'production');
const isDeveloper = (NODE_ENV == 'developer');

// Конфиг Hexo
const hexoConfig = yml("../../_config.yml");
console.dir(hexoConfig.theme);

// Webpack plugins
const extractCSS = require("extract-text-webpack-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// Настройка для SVGO-loader
let svgoConfig = JSON.stringify({
    plugins: [{
        removeTitle: true
    }, {
        removeUselessStrokeAndFill: true
    }, {
        removeAttrs: {
            attrs: '(stroke|fill)'
        },
    }, {
        convertColors: {
            shorthex: false
        }
    }, {
        convertPathData: true
    }]
});

module.exports = {
    context: path.join(__dirname, "src"),

    entry: {
        commons: './commons'
    },

    output: {
        path: path.join(__dirname, "source", "assets"),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    resolve: {
        alias: {
            'inputmask.dependencyLib': path.join(__dirname, 'node_modules/jquery.inputmask/extra/dependencyLibs/inputmask.dependencyLib.jqlite.js'),
            'inputmask': path.join(__dirname, 'node_modules/jquery.inputmask/dist/inputmask/inputmask.js')
        },
        modules: ['node_modules'],
        extensions: ['.js', ".json"]
    },
    resolveLoader: {
        modules: ["node_modules"],
        extensions: [".js", ".json"],
        mainFields: ["loader", "main"],
        moduleExtensions: ['-loader']
    },
    target: 'web',
    module: {
        // configuration regarding modules

        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            { // Javascript
                test: /\.js$/,
                include: [
                    path.join(__dirname, "src"),
                    path.join(__dirname, "node_modules", "svg-sprite-loader", "lib", "plugin.js")
                ],
                use: "babel?presets[]=es2015"
            }, /* { // SCSS в файлы
                test: /\.(sass|scss)$/,
                use: extractCSS.extract('css!sass')
            }, */
            { // SCSS в файлы
                test: /\.(sass|scss)$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: isProduction || {/* CSSNano Options */ }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },


            { // CSS в файлы 
                test: /\.(css)$/,
                use: extractCSS.extract('css!postcss')
            },

            { // Картинки 
                test: /\.(png|jpg|svg|gif)$/,
                exclude: path.join(__dirname, "src", "icons"),
                // use: 'file?name=images/[name].[ext]'
                use: [
                    'file-loader?name=images/[name].[ext]',
                    {
                      loader: 'image-webpack-loader',
                      options: {
                        mozjpeg: {
                          progressive: true,
                          quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                          enabled: false,
                        },
                        pngquant: {
                          quality: '65-90',
                          speed: 4
                        },
                        gifsicle: {
                          interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                          quality: 75
                        }
                      }
                    },
                  ],
            }, { // Копируем шрифты
                test: /\.(ttf|eot|woff|woff2)$/,
                use: 'file?name=assets/fonts/[path][name].[ext]'
            }, {
                test: /\.svg$/,
                include: path.join(__dirname, "src", "icons"),
                use: [

                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'icons/icons-sprite.svg'
                        }

                    }, {
                        loader: 'svgo-loader?' + svgoConfig
                    }
                ]
            },
            {
                test: /\.(png|json|xml|ico)$/,
                include: path.join(__dirname, "src", "images", "favicons"),
                loader: 'file-loader?name=images/favicons/[name].[ext]'
            }

        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new extractCSS({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            // NODE_ENV: JSON.stringify(NODE_ENV),
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            // In case you imported plugins individually, you must also require them here:
            Util: "exports-loader?Util!bootstrap/js/dist/util",
            Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
            Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
            Button: "exports-loader?Button!bootstrap/js/dist/button",
            Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
            Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
            Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
            Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
            Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
            Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
            Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip"
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "commons",
        //     minChunks: 2
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new SpriteLoaderPlugin()
    ],
    // watch: NODE_ENV == 'development',

    // watchOptions: {
    //     aggregateTimeout: 100
    // },
    // devServer: {
    //     contentBase: path.join(__dirname, "public", hexoConfig.theme, "assets")
    //     // hot: true

    // },
    devServer: {
        contentBase: __dirname + "/public/",
        // inline: true,
        // port: 8080
        // hot: true
        proxy: {
            "/": "http://localhost:4000"
        }
    }
};

if (isProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}