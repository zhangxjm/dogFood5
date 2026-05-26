from django.contrib import admin
from .models import Category, Poem, Appreciation, Comment


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'poem_count', 'created_at']
    search_fields = ['name', 'description']
    list_per_page = 20


@admin.register(Poem)
class PoemAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'dynasty', 'category', 'created_by', 'views', 'created_at']
    list_filter = ['dynasty', 'category', 'created_at']
    search_fields = ['title', 'author', 'content']
    list_per_page = 20


@admin.register(Appreciation)
class AppreciationAdmin(admin.ModelAdmin):
    list_display = ['title', 'poem', 'author', 'likes', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'content']
    list_per_page = 20


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'content', 'poem', 'appreciation', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content']
    list_per_page = 20
