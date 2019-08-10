const numberInput = document.getElementById('number'),
      textInput   = document.getElementById('msg'),
      button      = document.getElementById('button'),
      response    = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();

socket.on('smsStatus', function(data){
  if(data.error){
    response.innerHTML = '<h5>Mensagem de texto enviada para ' + data.error + '</h5>';
  }else{
    response.innerHTML = '<h5>Mensagem de texto enviada para ' + data.number + '</h5>';
  }
});

let timeOut;
const getTimeSchedule = ({ number, text }) => {
    fetchServer({ number, text });
};

const fetchServer = ({ number, text }) => {
  console.log('send');
  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ number, text })
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
};

function send() {
  const number = numberInput.value.replace(/\D/g, '');
  const text = textInput.value;
  getTimeSchedule({ number, text });
}