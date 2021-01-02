let classMarker = require('./marker')
let Marker = new classMarker();

class Socket {

    constructor(server) {
        this.io = require('socket.io')(server);

        this.io.on('connection', socket => {

            socket.emit('initMarkers', Marker.getAllMarkers());
            socket.emit('initProblems', Marker.getAllProblems());
            
            socket.on('addMarker', (latLng) => {
                const addedMarker = Marker.addMarker(latLng);
                
                if (addedMarker) {
                    socket.emit('addMarkerMe', latLng);
                    socket.broadcast.emit('addMarkerAll', latLng);
                }
            })
            
            socket.on('sendMail', ({email, msg}) => {
                console.log(email +": "+ msg);
                Marker.sendMail({email, msg});
            })
            
            socket.on('getMails', (data) => {
                const id = socket.id;
                const city = data.city;
                const polution = data.polution;
                
                data = Marker.getMails(city, polution);
                socket.emit('getMails', data)
            })
            
            socket.on('newProblem', (data)=>{
                Marker.addProblem(data)
                socket.broadcast.emit('newProblem', data);
            })
            
            socket.on('deleteMarker', obj => {
                Marker.deleteMarker();
                socket.broadcast.emit('resetMap', obj);
            })

            socket.on('disconnect', () => {
                console.log('diconnect');
            })
            
        });
    }
}

module.exports = Socket;
