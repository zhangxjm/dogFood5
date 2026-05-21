import streamlit as st
import pandas as pd
from datetime import date, time, datetime
from api_client import api_client

st.set_page_config(
    page_title="少儿绘画课时记录系统",
    page_icon="🎨",
    layout="wide"
)

st.title("🎨 少儿绘画课时记录系统")

page = st.sidebar.selectbox(
    "选择功能模块",
    ["首页概览", "学员管理", "课程管理", "课时记录", "课程排班"]
)

if page == "首页概览":
    st.header("📊 系统概览")
    
    stats = api_client.get_statistics()
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("学员总数", stats.get("total_students", 0))
    
    with col2:
        st.metric("总购买课时", stats.get("total_hours", 0))
    
    with col3:
        st.metric("已使用课时", stats.get("used_hours", 0))
    
    with col4:
        st.metric("剩余总课时", stats.get("remaining_hours", 0))
    
    st.subheader("本周课程安排")
    week_schedules = api_client.get_week_schedules()
    
    if week_schedules:
        df_schedules = pd.DataFrame(week_schedules)
        df_schedules = df_schedules[["date", "start_time", "end_time", "student_name", "course_name", "status", "notes"]]
        df_schedules.columns = ["日期", "开始时间", "结束时间", "学员", "课程", "状态", "备注"]
        st.dataframe(df_schedules, use_container_width=True)
    else:
        st.info("本周暂无课程安排")
    
    st.subheader("学员课时情况")
    students = api_client.get_students()
    
    if students:
        df_students = pd.DataFrame(students)
        df_students = df_students[["name", "total_hours", "used_hours", "remaining_hours", "phone"]]
        df_students.columns = ["学员姓名", "总课时", "已用课时", "剩余课时", "联系电话"]
        
        def highlight_low_hours(row):
            if row["剩余课时"] < 3:
                return ["background-color: #fff3cd"] * len(row)
            return [""] * len(row)
        
        styled_df = df_students.style.apply(highlight_low_hours, axis=1)
        st.dataframe(styled_df, use_container_width=True)
    else:
        st.info("暂无学员数据")

elif page == "学员管理":
    st.header("👦 学员管理")
    
    tab1, tab2 = st.tabs(["学员列表", "添加学员"])
    
    with tab1:
        students = api_client.get_students()
        
        if students:
            df = pd.DataFrame(students)
            df = df[["id", "name", "age", "parent_name", "phone", "total_hours", "used_hours", "remaining_hours"]]
            df.columns = ["ID", "姓名", "年龄", "家长姓名", "联系电话", "总课时", "已用课时", "剩余课时"]
            st.dataframe(df, use_container_width=True)
            
            st.subheader("编辑/删除学员")
            student_id = st.number_input("输入学员ID", min_value=1, step=1)
            action = st.selectbox("操作", ["编辑", "删除"])
            
            if action == "编辑":
                with st.form("edit_student"):
                    name = st.text_input("姓名")
                    age = st.number_input("年龄", min_value=3, max_value=18, step=1)
                    parent_name = st.text_input("家长姓名")
                    phone = st.text_input("联系电话")
                    total_hours = st.number_input("总课时", min_value=0, step=1)
                    
                    if st.form_submit_button("更新"):
                        data = {}
                        if name:
                            data["name"] = name
                        if age:
                            data["age"] = age
                        if parent_name:
                            data["parent_name"] = parent_name
                        if phone:
                            data["phone"] = phone
                        if total_hours:
                            data["total_hours"] = total_hours
                        
                        if data:
                            result = api_client.update_student(student_id, data)
                            if result:
                                st.success("更新成功！")
                                st.rerun()
                            else:
                                st.error("更新失败，请检查ID是否正确")
                        else:
                            st.warning("请至少填写一项要更新的内容")
            else:
                if st.button("确认删除", type="primary"):
                    if api_client.delete_student(student_id):
                        st.success("删除成功！")
                        st.rerun()
                    else:
                        st.error("删除失败，请检查ID是否正确")
        else:
            st.info("暂无学员数据")
    
    with tab2:
        with st.form("add_student"):
            name = st.text_input("学员姓名 *")
            age = st.number_input("年龄", min_value=3, max_value=18, step=1, value=6)
            parent_name = st.text_input("家长姓名")
            phone = st.text_input("联系电话")
            total_hours = st.number_input("购买课时", min_value=0, step=1, value=10)
            
            if st.form_submit_button("添加学员"):
                if not name:
                    st.error("请填写学员姓名")
                else:
                    data = {
                        "name": name,
                        "age": age,
                        "parent_name": parent_name,
                        "phone": phone,
                        "total_hours": total_hours
                    }
                    result = api_client.create_student(data)
                    if result:
                        st.success("学员添加成功！")
                        st.rerun()
                    else:
                        st.error("添加失败")

elif page == "课程管理":
    st.header("📚 课程管理")
    
    tab1, tab2 = st.tabs(["课程列表", "添加课程"])
    
    with tab1:
        courses = api_client.get_courses()
        
        if courses:
            df = pd.DataFrame(courses)
            df = df[["id", "name", "description", "hours_per_class"]]
            df.columns = ["ID", "课程名称", "描述", "每节课课时"]
            st.dataframe(df, use_container_width=True)
        else:
            st.info("暂无课程数据")
    
    with tab2:
        with st.form("add_course"):
            name = st.text_input("课程名称 *")
            description = st.text_area("课程描述")
            hours_per_class = st.number_input("每节课课时", min_value=1, max_value=4, step=1, value=1)
            
            if st.form_submit_button("添加课程"):
                if not name:
                    st.error("请填写课程名称")
                else:
                    data = {
                        "name": name,
                        "description": description,
                        "hours_per_class": hours_per_class
                    }
                    result = api_client.create_course(data)
                    if result:
                        st.success("课程添加成功！")
                        st.rerun()
                    else:
                        st.error("添加失败")

elif page == "课时记录":
    st.header("📝 课时记录")
    
    tab1, tab2 = st.tabs(["记录列表", "登记上课"])
    
    with tab1:
        records = api_client.get_records()
        
        if records:
            df = pd.DataFrame(records)
            df = df[["date", "student_name", "course_name", "hours_used", "notes"]]
            df.columns = ["日期", "学员", "课程", "使用课时", "备注"]
            st.dataframe(df, use_container_width=True)
        else:
            st.info("暂无上课记录")
    
    with tab2:
        students = api_client.get_students()
        courses = api_client.get_courses()
        
        if not students:
            st.warning("请先添加学员")
        elif not courses:
            st.warning("请先添加课程")
        else:
            with st.form("add_record"):
                student_options = {s["name"]: s["id"] for s in students}
                selected_student = st.selectbox("选择学员 *", options=list(student_options.keys()))
                
                course_options = {c["name"]: c["id"] for c in courses}
                selected_course = st.selectbox("选择课程 *", options=list(course_options.keys()))
                
                record_date = st.date_input("上课日期 *", value=date.today())
                hours_used = st.number_input("使用课时", min_value=1, max_value=4, step=1, value=1)
                notes = st.text_area("备注")
                
                student_id = student_options[selected_student]
                student_info = next((s for s in students if s["id"] == student_id), None)
                if student_info:
                    remaining = student_info["total_hours"] - student_info["used_hours"]
                    st.info(f"当前剩余课时: {remaining}")
                    if remaining < hours_used:
                        st.warning("剩余课时不足！")
                
                if st.form_submit_button("登记上课"):
                    data = {
                        "student_id": student_options[selected_student],
                        "course_id": course_options[selected_course],
                        "date": record_date.isoformat(),
                        "hours_used": hours_used,
                        "notes": notes
                    }
                    result = api_client.create_record(data)
                    if result:
                        st.success("上课登记成功！")
                        st.rerun()
                    else:
                        st.error("登记失败，可能课时不足")

elif page == "课程排班":
    st.header("📅 课程排班")
    
    tab1, tab2, tab3 = st.tabs(["全部排班", "本周排班", "添加排班"])
    
    with tab1:
        schedules = api_client.get_schedules()
        
        if schedules:
            df = pd.DataFrame(schedules)
            df = df[["date", "start_time", "end_time", "student_name", "course_name", "status", "notes"]]
            df.columns = ["日期", "开始时间", "结束时间", "学员", "课程", "状态", "备注"]
            st.dataframe(df, use_container_width=True)
        else:
            st.info("暂无排班数据")
    
    with tab2:
        week_schedules = api_client.get_week_schedules()
        
        if week_schedules:
            df = pd.DataFrame(week_schedules)
            df = df[["date", "start_time", "end_time", "student_name", "course_name", "status", "notes"]]
            df.columns = ["日期", "开始时间", "结束时间", "学员", "课程", "状态", "备注"]
            st.dataframe(df, use_container_width=True)
        else:
            st.info("本周暂无排班")
    
    with tab3:
        students = api_client.get_students()
        courses = api_client.get_courses()
        
        if not students:
            st.warning("请先添加学员")
        elif not courses:
            st.warning("请先添加课程")
        else:
            with st.form("add_schedule"):
                student_options = {s["name"]: s["id"] for s in students}
                selected_student = st.selectbox("选择学员 *", options=list(student_options.keys()))
                
                course_options = {c["name"]: c["id"] for c in courses}
                selected_course = st.selectbox("选择课程 *", options=list(course_options.keys()))
                
                schedule_date = st.date_input("上课日期 *", value=date.today())
                start_time = st.time_input("开始时间 *", value=time(9, 0))
                end_time = st.time_input("结束时间 *", value=time(10, 0))
                status = st.selectbox("状态", options=["scheduled", "completed", "cancelled"])
                notes = st.text_area("备注")
                
                if st.form_submit_button("添加排班"):
                    data = {
                        "student_id": student_options[selected_student],
                        "course_id": course_options[selected_course],
                        "date": schedule_date.isoformat(),
                        "start_time": start_time.isoformat(),
                        "end_time": end_time.isoformat(),
                        "status": status,
                        "notes": notes
                    }
                    result = api_client.create_schedule(data)
                    if result:
                        st.success("排班添加成功！")
                        st.rerun()
                    else:
                        st.error("添加失败")
