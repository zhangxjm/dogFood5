package com.voting.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class VoteRequest {

    @NotEmpty(message = "至少选择一个选项")
    private List<Long> optionIds;

    @NotNull(message = "投票者标识不能为空")
    private String voterIdentifier;
}
