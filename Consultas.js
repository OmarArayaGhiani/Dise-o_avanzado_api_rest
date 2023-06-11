const {Pool} = require("pg")
const format = require("pg-format")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgresql",
    database: "joyas",
    allowExitOnIdle: true,    
})

const getJoyas = async({limits = 6, order_by = "id_ASC", page = 1}) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits
    const consulta = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset)
    const {rows: joyas} = await pool.query(consulta)
    return joyas
}

const getHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
        return{
            nombre: j.nombre,
            url: `/joyas/joya/${j.id}`
        }
    })
    const total = joyas.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

const getJoyasById = async(id) => {
    const consulta = format("SELECT * FROM inventario WHERE id = %s", id)
    const {rows: joya} = await pool.query(consulta)
    return joya
}

const getJoyasByFilters = async({stock_min, stock_max, precio_min, precio_max, categoria, metal}) =>{
    let filtros = []
    const values = []
    const addFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const {length} = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }
    if (stock_min) addFiltro("stock", ">=", stock_min)
    if (stock_max) addFiltro("stock", "<=", stock_max)
    if (precio_min) addFiltro("precio", ">=", precio_min)
    if (precio_max) addFiltro("precio", "<=", precio_max)
    if (categoria) addFiltro("categoria", "=", categoria)
    if (metal) addFiltro("metal", "=", metal)

    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const {rows: joyas} = await pool.query(consulta, values)
    return joyas
}

module.exports = {getJoyas, getHATEOAS, getJoyasById, getJoyasByFilters}