package com.example.vuespringlabbackend.lostark.controller;

import com.example.vuespringlabbackend.lostark.api.LostArkNewsClient;
import com.example.vuespringlabbackend.lostark.dto.LostArkNewsResponse.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lostark/home")
public class LostArkHomeController {
    private final LostArkNewsClient news;
    @GetMapping("/notices")
    public List<Notice> notices() { return news.notices(); }
    @GetMapping("/events")
    public List<Event> events() { return news.events(); }
}
