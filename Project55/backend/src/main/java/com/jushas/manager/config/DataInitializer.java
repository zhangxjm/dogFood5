package com.jushas.manager.config;

import com.jushas.manager.entity.PlayerRecord;
import com.jushas.manager.entity.ScriptInventory;
import com.jushas.manager.entity.ScriptType;
import com.jushas.manager.entity.SessionRecord;
import com.jushas.manager.service.PlayerRecordService;
import com.jushas.manager.service.ScriptInventoryService;
import com.jushas.manager.service.ScriptTypeService;
import com.jushas.manager.service.SessionRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ScriptTypeService scriptTypeService;
    @Autowired
    private ScriptInventoryService scriptInventoryService;
    @Autowired
    private SessionRecordService sessionRecordService;
    @Autowired
    private PlayerRecordService playerRecordService;

    @Override
    public void run(String... args) {
        if (scriptTypeService.count() == 0) {
            initScriptTypes();
            initScriptInventories();
            initSessionRecords();
            initPlayerRecords();
        }
    }

    private void initScriptTypes() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        ScriptType t1 = new ScriptType();
        t1.setName("恐怖本");
        t1.setDescription("以惊悚、恐怖氛围为主的剧本");
        t1.setDifficulty(4);
        t1.setCreateTime(now);
        scriptTypeService.save(t1);

        ScriptType t2 = new ScriptType();
        t2.setName("情感本");
        t2.setDescription("注重情感表达和角色羁绊的剧本");
        t2.setDifficulty(2);
        t2.setCreateTime(now);
        scriptTypeService.save(t2);

        ScriptType t3 = new ScriptType();
        t3.setName("推理本");
        t3.setDescription("侧重逻辑推理和破案的剧本");
        t3.setDifficulty(5);
        t3.setCreateTime(now);
        scriptTypeService.save(t3);

        ScriptType t4 = new ScriptType();
        t4.setName("欢乐本");
        t4.setDescription("轻松愉快、互动性强的剧本");
        t4.setDifficulty(1);
        t4.setCreateTime(now);
        scriptTypeService.save(t4);

        ScriptType t5 = new ScriptType();
        t5.setName("硬核本");
        t5.setDescription("高难度推理，适合资深玩家");
        t5.setDifficulty(5);
        t5.setCreateTime(now);
        scriptTypeService.save(t5);
    }

    private void initScriptInventories() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        ScriptInventory s1 = new ScriptInventory();
        s1.setName("午夜惊魂");
        s1.setTypeId(1L);
        s1.setMinPlayers(5);
        s1.setMaxPlayers(8);
        s1.setDuration(240);
        s1.setAuthor("张三");
        s1.setPublisher("恐怖出版社");
        s1.setDescription("深夜老宅发生的连环诡异事件");
        s1.setTotalCopies(3);
        s1.setAvailableCopies(3);
        s1.setCreateTime(now);
        scriptInventoryService.save(s1);

        ScriptInventory s2 = new ScriptInventory();
        s2.setName("樱花飘落时");
        s2.setTypeId(2L);
        s2.setMinPlayers(4);
        s2.setMaxPlayers(6);
        s2.setDuration(210);
        s2.setAuthor("李四");
        s2.setPublisher("情感工作室");
        s2.setDescription("青春校园里的凄美爱情故事");
        s2.setTotalCopies(2);
        s2.setAvailableCopies(2);
        s2.setCreateTime(now);
        scriptInventoryService.save(s2);

        ScriptInventory s3 = new ScriptInventory();
        s3.setName("致命遗嘱");
        s3.setTypeId(3L);
        s3.setMinPlayers(6);
        s3.setMaxPlayers(8);
        s3.setDuration(300);
        s3.setAuthor("王五");
        s3.setPublisher("推理之巅");
        s3.setDescription("富豪家族的遗产争夺杀人案");
        s3.setTotalCopies(5);
        s3.setAvailableCopies(5);
        s3.setCreateTime(now);
        scriptInventoryService.save(s3);

        ScriptInventory s4 = new ScriptInventory();
        s4.setName("疯狂马戏团");
        s4.setTypeId(4L);
        s4.setMinPlayers(6);
        s4.setMaxPlayers(10);
        s4.setDuration(180);
        s4.setAuthor("赵六");
        s4.setPublisher("欢乐工坊");
        s4.setDescription("马戏团里的爆笑欢乐冒险");
        s4.setTotalCopies(4);
        s4.setAvailableCopies(4);
        s4.setCreateTime(now);
        scriptInventoryService.save(s4);

        ScriptInventory s5 = new ScriptInventory();
        s5.setName("量子迷局");
        s5.setTypeId(5L);
        s5.setMinPlayers(5);
        s5.setMaxPlayers(7);
        s5.setDuration(360);
        s5.setAuthor("陈七");
        s5.setPublisher("硬核联盟");
        s5.setDescription("穿越时空的复杂量子谜题");
        s5.setTotalCopies(2);
        s5.setAvailableCopies(2);
        s5.setCreateTime(now);
        scriptInventoryService.save(s5);
    }

    private void initSessionRecords() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        SessionRecord r1 = new SessionRecord();
        r1.setScriptId(1L);
        r1.setSessionName("午夜惊魂首场");
        r1.setHostName("DM小明");
        r1.setStartTime("2025-01-15 19:00:00");
        r1.setEndTime("2025-01-15 23:00:00");
        r1.setPlayerCount(6);
        r1.setStatus(2);
        r1.setRemarks("玩家反应良好，氛围到位");
        r1.setCreateTime(now);
        sessionRecordService.save(r1);

        SessionRecord r2 = new SessionRecord();
        r2.setScriptId(3L);
        r2.setSessionName("周末推理局");
        r2.setHostName("DM小红");
        r2.setStartTime("2025-01-18 14:00:00");
        r2.setEndTime("2025-01-18 19:00:00");
        r2.setPlayerCount(7);
        r2.setStatus(2);
        r2.setRemarks("高玩局，3小时破案");
        r2.setCreateTime(now);
        sessionRecordService.save(r2);

        SessionRecord r3 = new SessionRecord();
        r3.setScriptId(4L);
        r3.setSessionName("新手欢乐场");
        r3.setHostName("DM小刚");
        r3.setStartTime("2025-01-20 10:00:00");
        r3.setPlayerCount(8);
        r3.setStatus(1);
        r3.setRemarks("进行中");
        r3.setCreateTime(now);
        sessionRecordService.save(r3);
    }

    private void initPlayerRecords() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        PlayerRecord p1 = new PlayerRecord();
        p1.setSessionId(1L);
        p1.setPlayerName("张伟");
        p1.setPhone("13800138001");
        p1.setRoleName("李医生");
        p1.setScore(85);
        p1.setComments("剧情很精彩");
        p1.setCreateTime(now);
        playerRecordService.save(p1);

        PlayerRecord p2 = new PlayerRecord();
        p2.setSessionId(1L);
        p2.setPlayerName("王芳");
        p2.setPhone("13800138002");
        p2.setRoleName("陈护士");
        p2.setScore(90);
        p2.setComments("吓得不轻但很爽");
        p2.setCreateTime(now);
        playerRecordService.save(p2);

        PlayerRecord p3 = new PlayerRecord();
        p3.setSessionId(1L);
        p3.setPlayerName("刘洋");
        p3.setPhone("13800138003");
        p3.setRoleName("王管家");
        p3.setScore(88);
        p3.setComments("角色戏份很足");
        p3.setCreateTime(now);
        playerRecordService.save(p3);

        PlayerRecord p4 = new PlayerRecord();
        p4.setSessionId(2L);
        p4.setPlayerName("陈明");
        p4.setPhone("13800138004");
        p4.setRoleName("警探");
        p4.setScore(95);
        p4.setComments("推理过程很过瘾");
        p4.setCreateTime(now);
        playerRecordService.save(p4);

        PlayerRecord p5 = new PlayerRecord();
        p5.setSessionId(2L);
        p5.setPlayerName("赵丽");
        p5.setPhone("13800138005");
        p5.setRoleName("女仆");
        p5.setScore(82);
        p5.setComments("参与感不错");
        p5.setCreateTime(now);
        playerRecordService.save(p5);
    }
}
