package com.example.stompexample.controller

import com.example.stompexample.dto.Greeting
import com.example.stompexample.dto.HelloMessage
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller

@Controller
class GreetingController(private val messagingTemplate: SimpMessageSendingOperations) {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    fun greeting(message: HelloMessage): Greeting {
        Thread.sleep(1000)
        return Greeting("Hello ${message.name}")
    }

    // publish /app/string_list
    // this method trigger and return value
    // ??????????
    @MessageMapping("/string_list")
    @SendTo("/topic/string_list")
    fun getdummyList(): List<String> {
        return listOf("H", "E", "L", "L", "O", "W", "O", "R", "L", "D", "!")
    }

    @MessageMapping("/item")
    @SendTo("/topic/item1")
    fun getItemList(data: List<String>): List<String> {
        return data
    }

    // SubscribeMapping only works with "/app/item" ("/app" is excluded by default)
//    @SubscribeMapping("/item")
//    fun getSubscribedummyList(): List<String> {
//        return listOf("H", "E", "L", "L", "O", "W", "O", "R", "L", "D", "!", "!", "!", "!")
//    }
}
