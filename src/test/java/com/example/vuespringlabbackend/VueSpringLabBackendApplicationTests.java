package com.example.vuespringlabbackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:loatask-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "lostark.api.base-url=http://localhost:1",
        "lostark.api.key=test-key"
})
class VueSpringLabBackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
