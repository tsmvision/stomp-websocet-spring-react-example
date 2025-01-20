package com.example.stompexample.controller

import com.example.stompexample.dto.HelloMessage
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/trigger")
class TestController(private val messagingTemplate: SimpMessageSendingOperations) {
    @GetMapping
    fun trigger() {
        val greetingsMessage = HelloMessage("Hello from trigger!!!!!!!!!")
        messagingTemplate.convertAndSend("/topic/greetings", greetingsMessage)

        val itemMessage = listOf("Z", "Z", "Z")
        messagingTemplate.convertAndSend("/topic/item", itemMessage)
    }
}
