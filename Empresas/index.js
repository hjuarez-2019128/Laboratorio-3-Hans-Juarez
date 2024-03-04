// Inicia el servidor
import { initServer } from './configs/app.js'
import { connect } from "./configs/mongo.js"

initServer()
connect()