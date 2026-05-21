package com.snack.service;

import com.snack.dto.SnackDTO;
import com.snack.entity.Snack;
import com.snack.repository.SnackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SnackService {

    @Autowired
    private SnackRepository snackRepository;

    public List<Snack> listAll() {
        return snackRepository.findByActiveTrue();
    }

    public Optional<Snack> getById(Long id) {
        return snackRepository.findById(id);
    }

    public Snack create(SnackDTO dto) {
        Snack snack = new Snack();
        snack.setName(dto.getName());
        snack.setPrice(dto.getPrice());
        snack.setDescription(dto.getDescription());
        snack.setActive(dto.getActive() != null ? dto.getActive() : true);
        return snackRepository.save(snack);
    }

    public Snack update(Long id, SnackDTO dto) {
        Snack snack = snackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("小吃不存在"));
        snack.setName(dto.getName());
        snack.setPrice(dto.getPrice());
        snack.setDescription(dto.getDescription());
        if (dto.getActive() != null) {
            snack.setActive(dto.getActive());
        }
        return snackRepository.save(snack);
    }

    public void delete(Long id) {
        Snack snack = snackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("小吃不存在"));
        snack.setActive(false);
        snackRepository.save(snack);
    }
}
