
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())  // avisar pro express que vai usar JSON


const orders = []

const checkOrderId = (request, response, next) =>{

    const { id } = request.params
    const index = orders.findIndex( order => order.id === id)
    if(index < 0){
        return response.status(404).json({error: "order not found"})
    }

    request.orderIndex=index // checa o id e envia a informacao pro index
    request.orderID = id
    next()
}

const requests =(request, response,next) =>{
    const method = request.method 
    const Url = request.url
    console.log(method, Url)
    next()
}

app.use(requests)


app.post('/orders',(request, response) =>{
    const {ListOrder, clientName, price, status="Em preparação"} = request.body
    const order = {id:uuid.v4(),ListOrder , clientName, price, status} // criando usuario com ID unico universal
    orders.push(order)
    return response.status(201).json(order) // retorna todas as informacoes em caso positivo
})

app.get('/orders',(request, response) => {  // Rota e parametros
    const index = request.orderIndex
    return response.json(orders)  
}) 

app.put('/orders/:id', checkOrderId, (request, response) => {
    const {ListOrder, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderID
    const updateOrder = {id, ListOrder, clientName, price, status}
    orders[index] = updateOrder
    
    return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId,(request, response) => {
    const index = request.orderIndex
    orders.splice(index,1) // deleta o pedido selecionado
    return response.status(204).json()
})

app.get('/orders/:id',checkOrderId, (request, response) => {
    const index = request.orderIndex // define a variavel index
    return response.json(orders[index])  
})

app.patch('/orders/:id',checkOrderId, (request, response) => {
    const index = request.orderIndex
     orders[index].status = "Pronto"  // alterando o status do pedido
     return response.json(orders[index])
})

app.listen(port, () =>{     // porta
    console.log(`Server started on port ${port}`)
 })