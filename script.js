const api_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNDk2MDFlY2E4NDZiYzFlNzZmMjBiM2YyZGRlMDliMmU5MGI3ZWFhZTkwZDM1ZjUyN2JjYzg0ZmI3YjZmNmZiZmYyOTJhNTMwNzg4NTI0NWYiLCJpYXQiOjE2Njg2Nzk1NzAsIm5iZiI6MTY2ODY3OTU3MCwiZXhwIjoxNzAwMjE1NTcwLCJzdWIiOiIxODUxNCIsInNjb3BlcyI6W119.aiOM8cdfbdMZ4_sJgWn7hh2b2Znd6yViztRPtiCm-xeb72c6JIPyk9BCC7tD_HrCz7eypoMhThrjeWH3jU96og';
let urlForIataCode = `http://app.goflightlabs.com/cities?access_key=${api_key}&search=`;

let images = ["./capodocia.jpg","./sihlsee.jpeg","./tiber_river.jpeg"];

let imageelement= document.getElementById("image");
let counter=0;


setInterval(slideToNext,5000);
function slideToNext(){
    counter++;
    if(counter === images.length){
        counter=0;
    }
    if(counter < images.length){
        let nextSlide = images[counter];
        imageelement.style.backgroundImage  = `url(${nextSlide})`;
    }
}

//let urlForFlights = `https://app.goflightlabs.com/search-best-flights?access_key=${api_key}&adults=1&origin=MAD&destination=FCO&departureDate=2022-11-20`
let urlForFlights = `https://app.goflightlabs.com/search-best-flights?access_key=${api_key}&adults=1`
let arr ;

// HTML TAGS

let originInput = document.getElementById('origin');
let destinationInput = document.getElementById('destination');
let departureDateInput = document.getElementById('flightDate');
let fligtsSection = document.getElementById('flights');

//local storage get item
let getStoredOrigin = localStorage.getItem('originValue');
let getStoredDestination = localStorage.getItem('destinationValue');
let getStoredDate = localStorage.getItem('dateValue');

//fetch local storage
getDataFromApi(getStoredOrigin,getStoredDestination,getStoredDate,urlForIataCode,urlForFlights);


function searchFlights(){
  fligtsSection.innerHTML = ""
  let {origin,destination,flightDate} = getUserInputs();
  checkUserInputs(origin,destination,flightDate);
  console.log(origin,destination,flightDate);
  getDataFromApi(origin,destination,flightDate,urlForIataCode,urlForFlights)

}

function getUserInputs(){
  let origin;
  let destination;
  let flightDate;

  origin = originInput.value;
  destination = destinationInput.value;
  flightDate = departureDateInput.value;

  //local storage set items
  let storedOrigin = originInput.value;
  localStorage.setItem('originValue',storedOrigin);
  let storedDestination = destinationInput.value;
  localStorage.setItem('destinationValue',storedDestination);
  let storedDate = departureDateInput.value;
  localStorage.setItem('dateValue',storedDate);
  
  return {origin,destination,flightDate}


}

// add a check function for user inputs
function checkUserInputs(origin,destination,flightDate){

  return 1;
}

async function getDataFromApi(origin,destination,flightDate,urlForIataCode,urlForFlights){

  const responseForOrigin = await fetch(urlForIataCode + origin);
  const responseForDestination = await fetch(urlForIataCode + destination);

  const jsonForOrigin = await responseForOrigin.json();
  const jsonForDestination = await responseForDestination.json();
  
  const iata_codeForOrigin = jsonForOrigin[0]['iata_code'];
  const iata_codeForDestination = jsonForDestination[0]['iata_code'];

  urlForFlights =  urlForFlights + `&origin=${iata_codeForOrigin}&destination=${iata_codeForDestination}&departureDate=${flightDate}`

  const responseForFlights = await fetch(urlForFlights);
  const jsonForFlights = await responseForFlights.json();

  console.log(iata_codeForOrigin,iata_codeForDestination);
  console.log(jsonForFlights['data']);

  const buckets = jsonForFlights['data']['buckets'];


  for(let i=0;i<buckets.length;i++){
    let name = buckets[i]['name'];
    let categoryArticle = document.createElement('article');
    categoryArticle.setAttribute('id',name);
    let categoryHead = document.createElement('h3');
    categoryHead.innerText = name
    categoryArticle.appendChild(categoryHead);
    fligtsSection.appendChild(categoryArticle);
    let items = buckets[i]['items']
    let price;
    let flightNumber;
    let departureTime;
    let departureDate;
    let departureHour;
    let arrivalTime;
    let arrivalDate;
    let arrivalHour;
    let companyName;
    let companyLogoUrl;
    let deeplink;
      for(let j=0;j<items.length;j++){
        deeplink = items[j]['deeplink'];
        let legs = items[j]['legs'][0];
        price = items[j]['price']['formatted'];
        departureTime = legs['departure'];
        departureDate = departureTime.slice(0,10);
        departureHour = departureTime.slice(11,16);
        arrivalTime = legs['arrival'];
        arrivalDate = arrivalTime.slice(0,10);
        arrivalHour = arrivalTime.slice(11,16);
        companyName = legs['carriers']['marketing'][0]['name'];
        companyLogoUrl = legs['carriers']['marketing'][0]['logoUrl'];
        flightNumber = legs['segments'][0]['flightNumber'];
      
        console.log(name,price,flightNumber,departureDate,departureHour,arrivalDate,arrivalHour,companyName,flightNumber,deeplink);
        createAndSetTags(companyLogoUrl,companyName,flightNumber,departureHour,arrivalHour,price,categoryArticle,deeplink)
    }
  }

}


// Unit Test for functions
function test(){
  //console.log(getUserInputs());
  getDataFromApi(origin,destination,flightDate,urlForIataCode,urlForFlights,)
}


function createAndSetTags(companyLogoUrl,companyName,flightNumber,departureHour,arrivalHour,price,categoryArticle,deeplink ){
  let linkelement = document.createElement('a');
  let fligtDiv = document.createElement('div');
  fligtDiv.setAttribute('class','flightDiv');
  let infoDiv = document.createElement('div');
  infoDiv.setAttribute('class','infoDiv');

  // create
  let logoImg = document.createElement('img');
  let companyNameSpan = document.createElement('span');
  let flightNumberSpan = document.createElement('span');
  let departureHourSpan = document.createElement('span')
  let arrivalHourSpan = document.createElement('span');
  let priceSpan = document.createElement('span');

  // set
  linkelement.href = deeplink;
  logoImg.src = companyLogoUrl;
  companyNameSpan.innerText = companyName;
  flightNumberSpan.innerText = 'Flight Number: ' + flightNumber;
  departureHourSpan.innerText = departureHour;
  arrivalHourSpan.innerText = arrivalHour;
  priceSpan.innerText = price;

  // append

  infoDiv.appendChild(logoImg);
  infoDiv.appendChild(companyNameSpan);
  infoDiv.appendChild(flightNumberSpan);

  fligtDiv.appendChild(infoDiv);
  fligtDiv.appendChild(departureHourSpan);
  fligtDiv.appendChild(arrivalHourSpan)
  fligtDiv.appendChild(priceSpan);
  linkelement.appendChild(fligtDiv);

  
  categoryArticle.appendChild(linkelement);

}



// let images = ["family.jpg","family2.jpeg","family3.jpeg","family5.jpeg","family6.jpeg"];

// let imgTag = document.getElementsByTagName("img")[0];
// let counter=0;


// setInterval(slideToNext,2000);
// function slideToNext(){
//     counter++;
//     if(counter === images.length){
//         counter=0;
//     }
//     if(counter < images.length){
//         let nextSlide = images[counter];
//         imgTag.src = nextSlide;
//     }
// }
