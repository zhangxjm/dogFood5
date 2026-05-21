package com.voting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PollRequest {

    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200个字符")
    private String title;

    @Size(max = 1000, message = "描述长度不能超过1000个字符")
    private String description;

    @NotEmpty(message = "至少需要一个选项")
    private List<@NotBlank(message = "选项内容不能为空") String> options;

    private LocalDateTime deadline;

    private Boolean allowMultiple;
}
