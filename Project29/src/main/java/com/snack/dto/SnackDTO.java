package com.snack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SnackDTO {
    private Long id;

    @NotBlank(message = "小吃名称不能为空")
    private String name;

    @NotNull(message = "价格不能为空")
    @Positive(message = "价格必须大于0")
    private Double price;

    private String description;
    private Boolean active = true;
}
