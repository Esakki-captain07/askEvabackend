import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import exployeeRouter from './router/employeeRouter.js'
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const app = express()
const PORT = process.env.PORT || 3000

const swaggerDocument = YAML.load("./api.yaml")

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/employee', exployeeRouter)



app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
}
)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))