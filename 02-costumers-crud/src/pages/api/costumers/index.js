//Importando dependências
const { default: generateId } = require("../../../utils/utils.js")
const { writeFile } = require("fs").promises
const { join } = require("path")
const data = require("../../../../json/data.json")

//Manipulador de solicitações GET e POST
export default async function handler(req, res) {
    const method = req.method
    switch (method) {
        case "GET":
            return handleGET(res)
        case "POST":
            return await handlePOST(req, res)
        default:
            return res.status(405).json({ error: `Method ${method} not allowed` })
    }
}

//Manipuladores específicos por método HTTP
function handleGET(res) {
    try {
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: "Error 500: Server error", status: 500 })
    }
}
async function handlePOST(req, res) {
    const filePath = join(process.cwd(), "json/data.json")
    const costumer = req.body
    const keysScheme = ["name", "age"]

    //Validando entradas vazias no corpo da requisição
    if (Object.keys(costumer).length === 0) {
        res.status(400).json({ message: "Error 400: Wrong request", status: 400 })
    }

    for (let key of keysScheme) {
        if (costumer[key] === "" || costumer[key] === null || costumer[key] === undefined) {
            return res.status(400).json({ message: "Error 400: Wrong request", status: 400 })
        }
    }

    //Se houver um ID, não será um cadastro de cliente (POST) e portanto um erro é retornado
    if (costumer.id) {
        return res.status(400).send({
            message: "Error 400: only costumer registration is allowed in POST method",
            status: 400
        })
    }

    //Gerando um ID para o novo cliente e verificando se o mesmo ja existe em data.json
    let newId = generateId(20)
    let isIdRepeated = data.costumers.find((costumer) => costumer.id === newId)

    while (isIdRepeated) {
        newId = generateId(20)
        isIdRepeated = data.costumers.find((costumer) => costumer.id === newId)
    }

    const newData = {
        costumers: [...data.costumers, { id: newId, name: costumer.name, age: costumer.age }]
    }

    //Rescrevendo o arquivo data.json com o novo cliente cadastrado
    try {
        await writeFile(filePath, JSON.stringify(newData), { encoding: "utf-8" })
        return res
            .status(200)
            .json({ message: "Costumer registered with success!", status: 200 })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error 500: Error during the writing file", status: 500 })
    }
}
