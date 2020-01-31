const Categorias = require('../models/Categorias');
const Meeti = require('../models/Meeti');
const Grupos = require('../models/Grupos');
const Usuarios = require('../models/Usuarios');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const shortid = require('shortid');

exports.home = async (req, res) => {

    // Promise para consultas en home page
    const consultas = [];
    consultas.push( Categorias.findAll({}));
    consultas.push( Meeti.findAll ( {
        /// Para limitar los campos a mostrar
        attributes: ['slug','titulo','fecha','hora'],
        where: {
            fecha: { [Op.gte] : moment(new Date()).format("YYYY-MM-DD")}
        },
        limit: 3,
        order: [
            ['fecha', 'ASC']
        ],
        include : [
            {
                model : Grupos,
                attributes: ['imagen']
            },
            {
                model : Usuarios,
                attributes: ['nombre','imagen']
            }
        ]
    }));

    // extraer y pasar a la vista
    const [ categorias, meetis ] = await Promise.all(consultas);

    console.log(meetis);
    console.log(meetis.length);

    res.render('home', {
        nombrePagina : 'Inicio',
        categorias,
        meetis,
        moment
    })
};