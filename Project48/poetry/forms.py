from django import forms
from .models import Poem, Appreciation, Comment, Category


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '请输入分类名称',
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': '请输入分类描述',
                'rows': 3,
            }),
        }
        labels = {
            'name': '分类名称',
            'description': '分类描述',
        }


class PoemForm(forms.ModelForm):
    class Meta:
        model = Poem
        fields = ['title', 'author', 'dynasty', 'content', 'category']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '请输入诗词标题',
            }),
            'author': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '请输入作者',
            }),
            'dynasty': forms.Select(attrs={
                'class': 'form-control',
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': '请输入诗词内容',
                'rows': 8,
            }),
            'category': forms.Select(attrs={
                'class': 'form-control',
            }),
        }
        labels = {
            'title': '诗词标题',
            'author': '作者',
            'dynasty': '朝代',
            'content': '诗词内容',
            'category': '所属分类',
        }


class AppreciationForm(forms.ModelForm):
    class Meta:
        model = Appreciation
        fields = ['title', 'content']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '请输入赏析标题',
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': '请输入赏析内容',
                'rows': 10,
            }),
        }
        labels = {
            'title': '赏析标题',
            'content': '赏析内容',
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': '请输入您的评论...',
                'rows': 3,
            }),
        }
        labels = {
            'content': '评论内容',
        }
