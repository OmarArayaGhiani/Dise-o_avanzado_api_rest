const express = require("express")
const app = express()
const port = 3000

const {getJoyas, getHATEOAS, getJoyasById, getJoyasByFilters} = require("./Consultas")

const reportarConsulta = async(req, res, next) => {
    console.log(`${new Date().toLocaleString("es-ES")}`)
    console.log(`Consulta ${req.method} a la ruta ${req.path}`)
    console.log(`Query: ${JSON.stringify(req.query)}`)
    console.log(`Params: ${JSON.stringify(req.params)}`)
    next()
}

app.get("/joyas", reportarConsulta, async(req, res) => {
    try{
        const queryStrings = req.query
        const joyas = await getJoyas(queryStrings)
        const HATEOAS = await getHATEOAS(joyas)
        res.json(HATEOAS)
    }
    catch (error){
        res.status(500).send(error.message)
    }
})

app.get("/joyas/joya/:id", reportarConsulta, async(req, res) => {
    try{
        const {id} = req.params
        const joyas = await getJoyasById(id)
        res.json(joyas)
    }
    catch (error){
        res.status(500).send(error.message)
    }
})

app.get("/joyas/filtros", reportarConsulta, async(req, res) => {
    try{
        const queryStrings = req.query
        const joyas = await getJoyasByFilters(queryStrings)
        res.json(joyas)
    }
    catch (error){
        res.status(500).send(error.mesagge)
    }
})

app.listen(port, console.log("Server up"))

