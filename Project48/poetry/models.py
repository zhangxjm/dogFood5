from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name='分类名称', unique=True)
    description = models.TextField(verbose_name='分类描述', blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '诗词分类'
        verbose_name_plural = verbose_name
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def poem_count(self):
        return self.poems.count()


class Poem(models.Model):
    DYNASTY_CHOICES = [
        ('先秦', '先秦'),
        ('汉', '汉'),
        ('魏晋', '魏晋'),
        ('南北朝', '南北朝'),
        ('唐', '唐'),
        ('宋', '宋'),
        ('元', '元'),
        ('明', '明'),
        ('清', '清'),
        ('近现代', '近现代'),
        ('当代', '当代'),
    ]

    title = models.CharField(max_length=200, verbose_name='诗词标题')
    author = models.CharField(max_length=100, verbose_name='作者')
    dynasty = models.CharField(max_length=20, choices=DYNASTY_CHOICES, verbose_name='朝代', default='唐')
    content = models.TextField(verbose_name='诗词内容')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='poems', verbose_name='所属分类')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='录入人')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='录入时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    views = models.IntegerField(default=0, verbose_name='浏览次数')

    class Meta:
        verbose_name = '诗词'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.author}'

    @property
    def appreciation_count(self):
        return self.appreciations.count()

    @property
    def comment_count(self):
        return self.comments.count()


class Appreciation(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='appreciations', verbose_name='所属诗词')
    title = models.CharField(max_length=200, verbose_name='赏析标题')
    content = models.TextField(verbose_name='赏析内容')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='赏析作者')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='发布时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    likes = models.IntegerField(default=0, verbose_name='点赞数')

    class Meta:
        verbose_name = '诗词赏析'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.poem.title}'


class Comment(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments', verbose_name='所属诗词', null=True, blank=True)
    appreciation = models.ForeignKey(Appreciation, on_delete=models.CASCADE, related_name='comments', verbose_name='所属赏析', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='评论用户')
    content = models.TextField(verbose_name='评论内容')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', verbose_name='父评论')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='评论时间')

    class Meta:
        verbose_name = '用户评论'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.content[:50]}'
