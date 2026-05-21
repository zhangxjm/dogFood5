package com.orchard.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.orchard.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}
