package com.example.vuespringlabbackend.lostark.api;

import com.example.vuespringlabbackend.lostark.snapshot.*;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import tools.jackson.databind.ObjectMapper;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class SnapshotStorageFailureTests {
    @Test void databaseFailureDoesNotBreakSuccessfulLiveResponseOrExposeDetails() {
        var repository = mock(CharacterSnapshotRepository.class);
        when(repository.findById(anyString())).thenThrow(new DataAccessResourceFailureException("private connection details"));
        when(repository.save(any())).thenThrow(new DataAccessResourceFailureException("private connection details"));
        var binding = new CharacterSnapshotStore(repository, new ObjectMapper()).binding("PROFILE", String.class);
        assertTrue(binding.read("a").isEmpty());
        assertDoesNotThrow(() -> binding.write("a", "success", Instant.now()));
    }
}
