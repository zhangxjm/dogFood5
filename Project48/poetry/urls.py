from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('poems/', views.poem_list, name='poem_list'),
    path('poem/<int:pk>/', views.poem_detail, name='poem_detail'),
    path('poem/create/', views.poem_create, name='poem_create'),
    path('poem/<int:pk>/edit/', views.poem_edit, name='poem_edit'),
    path('poem/<int:pk>/delete/', views.poem_delete, name='poem_delete'),

    path('appreciations/', views.appreciation_list, name='appreciation_list'),
    path('appreciation/<int:pk>/', views.appreciation_detail, name='appreciation_detail'),
    path('appreciation/create/', views.appreciation_create, name='appreciation_create'),
    path('appreciation/create/<int:poem_pk>/', views.appreciation_create, name='appreciation_create_for_poem'),
    path('appreciation/<int:pk>/edit/', views.appreciation_edit, name='appreciation_edit'),
    path('appreciation/<int:pk>/delete/', views.appreciation_delete, name='appreciation_delete'),
    path('appreciation/<int:pk>/like/', views.appreciation_like, name='appreciation_like'),

    path('categories/', views.category_list, name='category_list'),
    path('category/<int:pk>/', views.category_detail, name='category_detail'),
    path('category/create/', views.category_create, name='category_create'),

    path('comment/<int:pk>/delete/', views.comment_delete, name='comment_delete'),

    path('login/', auth_views.LoginView.as_view(template_name='poetry/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]
