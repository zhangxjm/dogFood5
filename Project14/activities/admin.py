from django.contrib import admin
from .models import Activity, Registration, CheckIn


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['title', 'organizer', 'location', 'start_time', 'status', 'current_participants', 'max_participants']
    list_filter = ['status', 'organizer', 'start_time']
    search_fields = ['title', 'organizer', 'location', 'description']
    date_hierarchy = 'start_time'


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['student_name', 'student_id', 'college', 'activity', 'registered_at']
    list_filter = ['activity', 'college', 'registered_at']
    search_fields = ['student_name', 'student_id', 'college', 'phone']


@admin.register(CheckIn)
class CheckInAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'get_activity_title', 'checked_in_at']
    list_filter = ['checked_in_at']
    search_fields = ['registration__student_name', 'registration__activity__title']

    def get_student_name(self, obj):
        return obj.registration.student_name
    get_student_name.short_description = '学生姓名'

    def get_activity_title(self, obj):
        return obj.registration.activity.title
    get_activity_title.short_description = '活动名称'
