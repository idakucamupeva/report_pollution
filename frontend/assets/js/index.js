const socket = io();
let map;
let myMarker;
let markers = [];
let globalData;

const getMail = document.getElementById("getMail");
const nextMail = document.getElementById("nextMail");
const sendMail = document.getElementById("sendMail");
const deleteMarker = document.getElementById("deleteMarker")

socket.on('initMarkers', (arrMarkers) => {
    arrMarkers.forEach(m => addMarker(m))
})

socket.on('resetMap', (obj) => {
    for(let i=0; i<markers.length; i++) {
        const m = {
            "lat": markers[i].getPosition().lat(),
            "lng": markers[i].getPosition().lng()
        }
        if (obj.lat === m.lat && obj.lng === m.lng) {
            markers[i].setMap(null);
            markers.splice(i, 1);
            break;
        }
    }
})

socket.on('addMarkerMe', (latLng) => {
    myMarker = new google.maps.Marker({
        map: map,
        position: latLng,
        draqqable: true
    });
    markers.push(myMarker)
    map.setCenter(latLng);
})

socket.on('addMarkerAll', (latLng) => {
    addMarker(latLng);
})

socket.on('getMails', (data) => {
    data.email = data.email.split("\n");
    data.email.splice(data.email.length-1, 1);
    globalData = data;
    setMailsAndMsg(data)
})

socket.on('initProblems', arrProblems => {
    arrProblems.forEach(p => insertNewProblem(p));
})


socket.on('newProblem', data => {
    insertNewProblem(data);
})

/**********************************FUNCTIONS*************************************/
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 44.7866, lng: 20.4489 }
    });

    map.addListener('click', (e) => {
        const latLngJSON = JSON.stringify(e.latLng.toJSON(), null, 2);
        const latLng = JSON.parse(latLngJSON)
        
        if (myMarker === undefined) socket.emit('addMarker', latLng);
    })
}

function addMarker(latLng) {
    const marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draqqable: true
    });
    markers.push(marker)
    console.log(markers.length)
}

function getPolution() {
    if (globalData.polution === "Zagаđenje vode")
        return "VODA";
    else if(globalData.polution === "Zagаđenje vazduha")
        return "VAZDUH";
    else
        return "ZEMLJA";
}

function insertNewProblem(data) {
    const table = document.querySelector('tbody');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td1text = document.createTextNode(data.pol);
    td1.appendChild(td1text);

         
    const td2 = document.createElement('td');
    const td2text = document.createTextNode(data.city);
    td2.appendChild(td2text);
    
    const td3 = document.createElement('td');
    const td3text = document.createTextNode(data.date);
    td3.appendChild(td3text);
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
}

function insertProblemInTable() {
    
    const table = document.querySelector('tbody');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const pol = getPolution();
    console.log(pol)
    const td1text = document.createTextNode(pol);
    td1.appendChild(td1text);

         
    const td2 = document.createElement('td');
    console.log(globalData.city)
    const td2text = document.createTextNode(globalData.city);
    td2.appendChild(td2text);
    
    const td3 = document.createElement('td');
    const date = new Date();
    const strDate = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
    const td3text = document.createTextNode(strDate);
    td3.appendChild(td3text);
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
    socket.emit('newProblem', {pol, city: globalData.city, date: strDate})
    
}

async function getCity (latLng) {
    const latLngUrl = `${latLng.lat},${latLng.lng}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLngUrl}&key=AIzaSyAudB64fbnnD_d7JnadOPhd1UN0Nl7CowY`;
    let city;
    await $.get(url, (data) => {
                    const adress = data.results[1].formatted_address;
                    const arrAdress = adress.split(", ");
                    console.log(arrAdress)
                    if (arrAdress.length === 2) city = arrAdress[0];
                    else if (arrAdress.length === 3) city = arrAdress[1];
                })
    return city;
}


/****************************************************************************************/
getMail.addEventListener('click', (e) => {
    e.preventDefault();
    
    const category = document.getElementById("demo-category");
    let strCategory = category.options[category.selectedIndex].text;
    
    if (strCategory === "-" || myMarker === undefined) return;
    
    const obj = {
                "lat": myMarker.getPosition().lat(),
                "lng": myMarker.getPosition().lng()
                }
                
    getCity(obj).then(res => {
                        const data = {
                            city: res,
                            polution: strCategory
                        }
                        socket.emit('getMails', data);
                    });
})
    
sendMail.addEventListener('click', (e) => {
    
    e.preventDefault();

    
    if (globalData === undefined) return false;
    
    let rb, i=0, email;
    while (true) {
        rb = document.getElementById("radio"+i)
        if (rb.checked) {
            let selector = 'label[for=radio'+i+']';
            let label = document.querySelector(selector);
            email = label.innerHTML;
            break;
        }
        i++;
    }
    insertProblemInTable();
    
    socket.emit('sendMail', ({email:email, msg:globalData.msg}));
    const options = document.getElementById("options");
    options.innerHTML = "";
    globalData = undefined;
    myMarker = undefined;
})

deleteMarker.addEventListener('click', (e) => {
    const options = document.getElementById("options");
    options.innerHTML = "";
    globalData = undefined;
    
    if (myMarker !== undefined){
        const obj = {
            "lat": myMarker.getPosition().lat(),
            "lng": myMarker.getPosition().lng()
        }
        const pos = markers.indexOf(myMarker);
        markers.splice(pos, 1);
        myMarker.setMap(null);
        myMarker = undefined;
        socket.emit('deleteMarker', obj);
    }
})

function setMailsAndMsg(data) {
    const mails = data.email;
    const msg = data.msg;
    const options = document.getElementById("options");
    options.innerHTML = "";
    
    let j = 0;
    for (let i=0; i<mails.length; i++) {
        const div=document.createElement('div');
        div.classList.add("field")
        div.classList.add("half")
        div.classList.add("setMail")
        const radio = "radio"+j++;
        div.innerHTML = `
                        <input type="radio" id=${radio} name="demo-priority">
                        <label for=${radio}>${mails[i]}</label>
                        `
        options.appendChild(div)        
    }
    
    const pre = document.createElement('pre');
    pre.classList.add('msg')
    const code = document.createElement('code');
    code.textContent = msg;
    pre.appendChild(code);
    options.appendChild(pre);
}


