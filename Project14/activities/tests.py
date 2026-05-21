from django.test import TestCase
from .models import Activity, Registration, CheckIn
from django.contrib.auth.models import User
from django.utils import timezone


class ActivityModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.activity = Activity.objects.create(
            title='测试活动',
            description='活动描述',
            organizer='计算机学院',
            location='教学楼101',
            start_time=timezone.now() + timezone.timedelta(days=1),
            end_time=timezone.now() + timezone.timedelta(days=2),
            max_participants=50,
            created_by=self.user
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.title, '测试活动')
        self.assertEqual(self.activity.status, 'upcoming')

    def test_can_register(self):
        self.assertTrue(self.activity.can_register())
