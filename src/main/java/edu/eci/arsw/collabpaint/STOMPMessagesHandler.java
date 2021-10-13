package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;

    private final HashMap<String, List<Point>> polygon = new HashMap<String, List<Point>>();

    @MessageMapping("/newpoint.{numDibujo}")
    public synchronized void handlePointEvent(Point pt, @DestinationVariable String numDibujo) throws Exception{
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        makePolygon(pt, numDibujo);
        if(polygon.get(numDibujo).size() >= 3){
            msgt.convertAndSend("/topic/newpolygon."+numDibujo,polygon.get(numDibujo));
        }
        msgt.convertAndSend("/topic/newpoint."+numDibujo, pt);
    }

    public void makePolygon(Point pt, String numDibujo){
        List<Point> points = new LinkedList<>();
        if(polygon.containsKey(numDibujo)){
            points = polygon.get(numDibujo);
        }
        points.add(pt);
        polygon.put(numDibujo,points);
        System.out.println(numDibujo+":"+polygon.get(numDibujo));
    }
}

