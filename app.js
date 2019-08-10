const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo - chave da Api de acesso do Nexmo
const nexmo = new Nexmo({
  apiKey: '',
  apiSecret: ''
}, { debug: true });

// Init app
const app = express();

// Configuração do mecanismo de modelo
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Configuração de pasta pública
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

// Catch form submit
app.post('/', (req, res) => {

  const { number, text } = req.body;

  nexmo.message.sendSms(
    'YOURVURTUALNUMBER', number, text, { type: 'unicode' },
    (err, responseData) => {
      if(err) {
        console.log(err);
      } else {
        const { messages } = responseData;
        const { ['message-id']: id, ['to']: number, ['error-text']: error  } = messages[0];
        console.dir(responseData);
        // Get data from response
        const data = {
          id,
          number,
          error
        };

        // Emite para o cliente -> Nexmo
        io.emit('smsStatus', data);
      }
    }
  );
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => 
  console.log(`Server started on port ${port}`));

// Conecta com socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
});