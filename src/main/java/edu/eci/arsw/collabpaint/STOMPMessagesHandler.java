package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
/*
@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newpoint.{numDibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numDibujo) throws Exception{
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        msgt.convertAndSend("/topic/newpoint."+numDibujo, pt);
    }
}
*/