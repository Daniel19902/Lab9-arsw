var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }

    
    var stompClient = null;
    let identificador = 0;

    var addPointToCanvas = function (point) {
        console.log(point);
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var paintPolygonToCanvas = function (polygon){
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i <polygon.length; i++){
            ctx.lineTo(polygon[i].x, polygon[i].y);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            //console.log('/topic/newpoint.'+identificador);
            stompClient.subscribe('/topic/newpolygon.'+identificador,function (eventBody){
                var theObject=JSON.parse(eventBody.body);
                paintPolygonToCanvas(theObject);
            });
            stompClient.subscribe('/topic/newpoint.'+identificador, function (eventbody) {
                var theObject=JSON.parse(eventbody.body);
                addPointToCanvas(theObject);
            });
        });
    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            identificador = $('#id').val();
            console.log(identificador);
            connectAndSubscribe();
            //websocket connection
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            //publicar el evento
            stompClient.send("/app/newpoint."+identificador, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();