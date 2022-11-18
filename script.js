// API KEY and urls
const api_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiM2U2NmE2MzhiNWJjNWU1OGY0ZjM5MDNiNmNhNmI0NzFjMjllNWIxMDRkMWVlNzliYWJiZmJhYjIwYjRlNjM2NTM5NjYwZGE4MGFlOTM4OTIiLCJpYXQiOjE2Njg3NzEzODYsIm5iZiI6MTY2ODc3MTM4NiwiZXhwIjoxNzAwMzA3Mzg2LCJzdWIiOiIxODYzNCIsInNjb3BlcyI6W119.AtnpsXeQexBfswLcfb_HAKzG-XaheEDliCvD_auUxrdqGB3yhWaCakdEpBQEZQ0xM_XK7NfAqXxphZSW114ugA';
let urlForIataCode = `http://app.goflightlabs.com/cities?access_key=${api_key}&search=`;

let urlForFlights = `https://app.goflightlabs.com/search-best-flights?access_key=${api_key}&adults=1`;


// image slider
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



// Global Static HTML TAGS

let originInput = document.getElementById('origin');
let destinationInput = document.getElementById('destination');
let departureDateInput = document.getElementById('flightDate');
let fligtsSection = document.getElementById('flights');
let loadingSection = document.getElementById('loading');

//local storage get item
let getStoredOrigin = localStorage.getItem('originValue');
let getStoredDestination = localStorage.getItem('destinationValue');
let getStoredDate = localStorage.getItem('dateValue');

//stored input values
originInput.value = getStoredOrigin;
destinationInput.value = getStoredDestination;
departureDateInput.value = getStoredDate;
//fetch local storage
getDataFromApi(getStoredOrigin,getStoredDestination,getStoredDate,urlForIataCode,urlForFlights);



function searchFlights(){
  fligtsSection.innerHTML = "";
  loadingSection.style.display = 'flex';
  fligtsSection.style.display='none';
  let {origin,destination,flightDate} = getUserInputs();
  let valid = checkUserInputs(origin,destination,flightDate);
  if(!valid){
    loadingSection.style.display = 'none';
    fligtsSection.style.display='flex';
    clearInputs();
    window.alert('Please Check Your Inputs!')
    return
  }
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
  if(origin==""||destination==""||flightDate==""){
    return false
  }else{
    return true
  }
}

async function getDataFromApi(origin,destination,flightDate,urlForIataCode,urlForFlights){

  const responseForOrigin = await fetch(urlForIataCode + origin);
  const responseForDestination = await fetch(urlForIataCode + destination);

  const jsonForOrigin = await responseForOrigin.json();
  const jsonForDestination = await responseForDestination.json();

  console.log(jsonForOrigin);
  
  const iata_codeForOrigin = jsonForOrigin[0]['iata_code'];
  const iata_codeForDestination = jsonForDestination[0]['iata_code'];

  urlForFlights =  urlForFlights + `&origin=${iata_codeForOrigin}&destination=${iata_codeForDestination}&departureDate=${flightDate}`

  const responseForFlights = await fetch(urlForFlights);
  const jsonForFlights = await responseForFlights.json();
  loadingSection.style.display = 'none';
  fligtsSection.style.display='flex';

  console.log(iata_codeForOrigin,iata_codeForDestination);
  console.log(jsonForFlights['data']);

  const buckets = jsonForFlights['data']['buckets'];


  for(let i=0;i<buckets.length;i++){
    let name = buckets[i]['name'];
    let categoryArticle = document.createElement('article');
    categoryArticle.setAttribute('id',name);
    let categoryHead = document.createElement('h3');
    categoryHead.innerText = name;
    categoryArticle.appendChild(categoryHead);
    fligtsSection.appendChild(categoryArticle);
    let items = buckets[i]['items'];
    let {price,flightNumber,departureTime,departureDate,departureHour,arrivalTime,arrivalDate,arrivalHour,companyName,companyLogoUrl}='';
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
  let flightHourDiv = document.createElement('div');
  let departureHourSpan = document.createElement('span');
  let departureIcon = document.createElement('i');
  let arrivalHourSpan = document.createElement('span');
  let arrivalIcon = document.createElement('i');
  let priceSpan = document.createElement('span');

  // set
  linkelement.href = deeplink;
  logoImg.src = companyLogoUrl;
  companyNameSpan.innerText = companyName;
  flightNumberSpan.innerText = 'Flight Nr.: ' + flightNumber;
  departureHourSpan.innerText = departureHour;
  arrivalHourSpan.innerText = arrivalHour;
  priceSpan.innerText = price;
  departureIcon.setAttribute('class','fa-solid fa-plane-departure');
  arrivalIcon.setAttribute('class','fa-solid fa-plane-arrival');
  flightHourDiv.setAttribute('id','flightHourDiv');

  // append

  infoDiv.appendChild(logoImg);
  infoDiv.appendChild(companyNameSpan);
  infoDiv.appendChild(flightNumberSpan);

  departureHourSpan.appendChild(departureIcon);
  arrivalHourSpan.appendChild(arrivalIcon);

  fligtDiv.appendChild(infoDiv);
  fligtDiv.appendChild(flightHourDiv);
  flightHourDiv.appendChild(departureHourSpan);
  flightHourDiv.appendChild(arrivalHourSpan);
  // fligtDiv.appendChild(departureHourSpan);
  // fligtDiv.appendChild(arrivalHourSpan)
  fligtDiv.appendChild(priceSpan);
  linkelement.appendChild(fligtDiv);

  
  categoryArticle.appendChild(linkelement);
  //clearInputs();
  

}

function clearInputs(){
  originInput.value = "";
  destinationInput.value ="";
  departureDateInput.value ="";
}


