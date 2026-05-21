package com.snack.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SaleRecordDTO {
    private Long id;

    @NotNull(message = "小吃ID不能为空")
    private Long snackId;

    private String snackName;

    @NotNull(message = "数量不能为空")
    @Positive(message = "数量必须大于0")
    private Integer quantity;

    private Double unitPrice;
    private Double totalAmount;
    private LocalDate saleDate;
}
