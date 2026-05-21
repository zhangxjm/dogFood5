from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Activity(models.Model):
    STATUS_CHOICES = [
        ('upcoming', '即将开始'),
        ('ongoing', '进行中'),
        ('ended', '已结束'),
        ('cancelled', '已取消'),
    ]

    title = models.CharField('活动标题', max_length=200)
    description = models.TextField('活动描述')
    organizer = models.CharField('主办方', max_length=100)
    location = models.CharField('活动地点', max_length=200)
    start_time = models.DateTimeField('开始时间')
    end_time = models.DateTimeField('结束时间')
    max_participants = models.IntegerField('最大人数', default=50)
    current_participants = models.IntegerField('当前报名人数', default=0)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='发布人')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)
    image = models.ImageField('活动图片', upload_to='activity_images/', blank=True, null=True)

    class Meta:
        verbose_name = '活动'
        verbose_name_plural = '活动'
        ordering = ['-start_time']

    def __str__(self):
        return self.title

    def is_registration_open(self):
        now = timezone.now()
        return now < self.start_time and self.status == 'upcoming'

    def can_register(self):
        return self.is_registration_open() and self.current_participants < self.max_participants

    def save(self, *args, **kwargs):
        now = timezone.now()
        if now > self.end_time:
            self.status = 'ended'
        elif now > self.start_time:
            self.status = 'ongoing'
        else:
            self.status = 'upcoming'
        super().save(*args, **kwargs)


class Registration(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, verbose_name='活动')
    student_name = models.CharField('学生姓名', max_length=100)
    student_id = models.CharField('学号', max_length=50)
    college = models.CharField('学院', max_length=100)
    phone = models.CharField('联系电话', max_length=20)
    email = models.EmailField('邮箱', blank=True, null=True)
    registered_at = models.DateTimeField('报名时间', auto_now_add=True)
    remarks = models.TextField('备注', blank=True, null=True)

    class Meta:
        verbose_name = '报名记录'
        verbose_name_plural = '报名记录'
        unique_together = ['activity', 'student_id']
        ordering = ['-registered_at']

    def __str__(self):
        return f'{self.student_name} - {self.activity.title}'


class CheckIn(models.Model):
    registration = models.OneToOneField(Registration, on_delete=models.CASCADE, verbose_name='报名记录')
    checked_in_at = models.DateTimeField('签到时间', auto_now_add=True)
    checked_in_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='签到操作人')

    class Meta:
        verbose_name = '签到记录'
        verbose_name_plural = '签到记录'
        ordering = ['-checked_in_at']

    def __str__(self):
        return f'{self.registration.student_name} - 已签到'
