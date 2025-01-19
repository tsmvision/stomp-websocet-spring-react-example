package com.example.stompexample.controller

import com.example.stompexample.dto.Greeting
import com.example.stompexample.dto.HelloMessage
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class GreetingController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    fun greeting(message: HelloMessage): Greeting {
        Thread.sleep(1000)
        return Greeting("Hello ${message.name}")
    }
}
