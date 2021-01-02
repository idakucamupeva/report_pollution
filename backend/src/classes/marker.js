var nodemailer = require('nodemailer');

class Marker {
    constructor () {
        this.coords = [];
        this.problems = [];
    }

    addMarker(latLng) {
        if (this.contains(latLng)) return false;
        
        this.coords.push(latLng);
        return true;
    }

    contains(latLng) {
        for (let i=0; i<this.coords.length; i++){
            const lat = this.coords[i].lat;
            const lng = this.coords[i].lng;
    
            const horizontal = latLng.lat-0.002 < lat && lat < latLng.lat+0.0023;   
            const vertical = latLng.lng-0.002 < lng && lng < latLng.lng+0.002;
            if (horizontal && vertical) return true;
        }
        return false;
    }

    getAllMarkers() {
        return this.coords;
    }
    
    deleteMarker(obj) {
        const pos = this.coords.indexOf(obj);
        if (this.coords.splice(pos, 1))
            console.log('obrisano sa servera');
        
    }
    
     getMails(city, polution) {
        
        const command = this.getCommand(polution)
        const program = "/home/mihailo/Documents/bchakaton/bc-hakaton/backend/src/scraping.py" + command + " grad " + city;
        console.log(program)
        
        var child = require('child_process').exec(program)
        const exec = require("child_process").execSync;
        var result = exec(program);
        console.log(result.toString("utf8"));
        
        
        return {
            city,
            polution,
            email: result.toString("utf8"),
            msg: `Poštovani,

Dobili smo prijavu na lokaciji ${city}.
Problem koji se može uočiti je ${polution}. 
Ovim putem Vas molimo da rešite 
problem u što kraćem roku radi 
sprečavanja daljeg uništavanja prirode!

Unapred zahvalni,
BC Hackaton team Three and a half men`
        }
    }
    
    
    addProblem(data) {
        this.problems.push(data);
    }
    
    getAllProblems() {
        return this.problems;
    }
    
    getCommand(str) {
        if (str==="Zagаđenje vode") return "vodovod i kanalizacija"
        else return "javno komunalno preduzece"
    }
    
    sendMail({email, msg}) {
        console.log('marker')
        console.log(email)
        console.log(msg)
    };
    
}

module.exports = Marker;
