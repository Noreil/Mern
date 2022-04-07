const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.nvhzt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));