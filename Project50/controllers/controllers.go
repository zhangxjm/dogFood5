package controllers

import (
	"encoding/json"
	"strconv"
	"time"

	"campus-express/models"

	beego "github.com/beego/beego/v2/server/web"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Title"] = "校园快递代取登记系统"
	c.TplName = "index.html"
}

type CourierController struct {
	beego.Controller
}

func (c *CourierController) List() {
	var couriers []models.Courier
	err := models.Engine.Desc("id").Find(&couriers)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "查询失败", "data": nil}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "success", "data": couriers}
	}
	c.ServeJSON()
}

func (c *CourierController) Add() {
	var courier models.Courier
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &courier); err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	if courier.Name == "" || courier.Phone == "" || courier.StudentId == "" {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "姓名、电话、学号不能为空"}
		c.ServeJSON()
		return
	}

	_, err := models.Engine.Insert(&courier)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "添加失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "添加成功", "data": courier}
	}
	c.ServeJSON()
}

func (c *CourierController) Update() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	var courier models.Courier
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &courier); err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	courier.Id = id
	_, err = models.Engine.ID(id).Update(&courier)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "更新失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "更新成功"}
	}
	c.ServeJSON()
}

func (c *CourierController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	_, err = models.Engine.ID(id).Delete(&models.Courier{})
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "删除失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "删除成功"}
	}
	c.ServeJSON()
}

type ExpressController struct {
	beego.Controller
}

func (c *ExpressController) List() {
	statusStr := c.GetString("status")
	keyword := c.GetString("keyword")

	var expressList []models.Express
	query := models.Engine.Desc("id")

	if statusStr != "" {
		status, _ := strconv.Atoi(statusStr)
		query = query.Where("status = ?", status)
	}
	if keyword != "" {
		query = query.Where("express_no like ? or receiver_name like ? or receiver_phone like ?", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
	}

	err := query.Find(&expressList)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "查询失败", "data": nil}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "success", "data": expressList}
	}
	c.ServeJSON()
}

func (c *ExpressController) GetOne() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	var express models.Express
	has, err := models.Engine.ID(id).Get(&express)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "查询失败"}
	} else if !has {
		c.Data["json"] = map[string]interface{}{"code": 404, "msg": "记录不存在"}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "success", "data": express}
	}
	c.ServeJSON()
}

func (c *ExpressController) Add() {
	var express models.Express
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &express); err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	if express.ExpressNo == "" || express.ReceiverName == "" || express.ReceiverPhone == "" {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "快递单号、收件人姓名、电话不能为空"}
		c.ServeJSON()
		return
	}

	express.Status = 0
	if express.CourierId > 0 {
		express.Status = 1
	}

	_, err := models.Engine.Insert(&express)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "添加失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "添加成功", "data": express}
	}
	c.ServeJSON()
}

func (c *ExpressController) Update() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	var express models.Express
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &express); err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	express.Id = id
	_, err = models.Engine.ID(id).Update(&express)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "更新失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "更新成功"}
	}
	c.ServeJSON()
}

func (c *ExpressController) Assign() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	var data struct {
		CourierId   int64  `json:"courier_id"`
		CourierName string `json:"courier_name"`
	}
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &data); err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	_, err = models.Engine.ID(id).Update(&models.Express{
		CourierId:   data.CourierId,
		CourierName: data.CourierName,
		Status:      1,
	})
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "分配失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "分配成功"}
	}
	c.ServeJSON()
}

func (c *ExpressController) Complete() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	var express models.Express
	has, err := models.Engine.ID(id).Get(&express)
	if err != nil || !has {
		c.Data["json"] = map[string]interface{}{"code": 404, "msg": "记录不存在"}
		c.ServeJSON()
		return
	}

	express.Status = 2
	models.Engine.ID(id).Update(&express)

	record := models.PickupRecord{
		ExpressId:   express.Id,
		ExpressNo:   express.ExpressNo,
		CourierId:   express.CourierId,
		CourierName: express.CourierName,
		PickupTime:  time.Now(),
		Remark:      "代取完成",
	}
	models.Engine.Insert(&record)

	c.Data["json"] = map[string]interface{}{"code": 200, "msg": "完成成功"}
	c.ServeJSON()
}

func (c *ExpressController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 400, "msg": "参数错误"}
		c.ServeJSON()
		return
	}

	_, err = models.Engine.ID(id).Delete(&models.Express{})
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "删除失败: " + err.Error()}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "删除成功"}
	}
	c.ServeJSON()
}

type RecordController struct {
	beego.Controller
}

func (c *RecordController) List() {
	keyword := c.GetString("keyword")
	courierIdStr := c.GetString("courier_id")

	var records []models.PickupRecord
	query := models.Engine.Desc("id")

	if courierIdStr != "" {
		courierId, _ := strconv.ParseInt(courierIdStr, 10, 64)
		query = query.Where("courier_id = ?", courierId)
	}
	if keyword != "" {
		query = query.Where("express_no like ? or courier_name like ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	err := query.Find(&records)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"code": 500, "msg": "查询失败", "data": nil}
	} else {
		c.Data["json"] = map[string]interface{}{"code": 200, "msg": "success", "data": records}
	}
	c.ServeJSON()
}

type StatsController struct {
	beego.Controller
}

func (c *StatsController) Get() {
	total, _ := models.Engine.Count(&models.Express{})
	pending, _ := models.Engine.Where("status = 0").Count(&models.Express{})
	assigned, _ := models.Engine.Where("status = 1").Count(&models.Express{})
	completed, _ := models.Engine.Where("status = 2").Count(&models.Express{})
	couriers, _ := models.Engine.Count(&models.Courier{})

	c.Data["json"] = map[string]interface{}{
		"code": 200,
		"data": map[string]interface{}{
			"total":     total,
			"pending":   pending,
			"assigned":  assigned,
			"completed": completed,
			"couriers":  couriers,
		},
	}
	c.ServeJSON()
}
