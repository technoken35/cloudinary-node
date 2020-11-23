const myArr = ['chicken.com', 'turkey.vid', 'tomatoes.jpg'];

const newArr = myArr.map((item) => {
  let formattedID = item.slice(0, item.length - 4);
  return formattedID;
});

console.log(
  'hello my name is maiya and i have the most gorilla grip coochie that you have ever had :P'
);

function mybiggestconfession(num1, num2) {
  console.log(num1 + num2);
}
mybiggestconfession(1, 2);

function run() {
  var raw = JSON.stringify({ folderName: 'unlv' });

  var requestOptions = {
    method: 'GET',
    body: raw,
    redirect: 'follow',
  };

  fetch(
    'https://desolate-everglades-01373.herokuapp.com/search',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
}

run();
