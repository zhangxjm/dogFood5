from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.core.paginator import Paginator
from .models import Category, Poem, Appreciation, Comment
from .forms import CategoryForm, PoemForm, AppreciationForm, CommentForm


def index(request):
    poems = Poem.objects.all()[:6]
    categories = Category.objects.all()
    appreciations = Appreciation.objects.all()[:4]
    context = {
        'poems': poems,
        'categories': categories,
        'appreciations': appreciations,
    }
    return render(request, 'poetry/index.html', context)


def poem_list(request):
    query = request.GET.get('q', '')
    category_id = request.GET.get('category', '')
    dynasty = request.GET.get('dynasty', '')

    poems = Poem.objects.all()

    if query:
        poems = poems.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(content__icontains=query)
        )

    if category_id:
        poems = poems.filter(category_id=category_id)

    if dynasty:
        poems = poems.filter(dynasty=dynasty)

    paginator = Paginator(poems, 10)
    page = request.GET.get('page', 1)
    poems = paginator.get_page(page)

    categories = Category.objects.all()

    context = {
        'poems': poems,
        'categories': categories,
        'query': query,
        'category_id': category_id,
        'dynasty': dynasty,
        'dynasty_choices': Poem.DYNASTY_CHOICES,
    }
    return render(request, 'poetry/poem_list.html', context)


def poem_detail(request, pk):
    poem = get_object_or_404(Poem, pk=pk)
    poem.views += 1
    poem.save()

    if request.method == 'POST' and request.user.is_authenticated:
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.poem = poem
            comment.save()
            messages.success(request, '评论发表成功！')
            return redirect('poem_detail', pk=pk)
    else:
        form = CommentForm()

    comments = poem.comments.filter(parent=None)

    context = {
        'poem': poem,
        'form': form,
        'comments': comments,
    }
    return render(request, 'poetry/poem_detail.html', context)


@login_required
def poem_create(request):
    if request.method == 'POST':
        form = PoemForm(request.POST)
        if form.is_valid():
            poem = form.save(commit=False)
            poem.created_by = request.user
            poem.save()
            messages.success(request, '诗词录入成功！')
            return redirect('poem_detail', pk=poem.pk)
    else:
        form = PoemForm()

    categories = Category.objects.all()
    context = {
        'form': form,
        'categories': categories,
    }
    return render(request, 'poetry/poem_form.html', context)


@login_required
def poem_edit(request, pk):
    poem = get_object_or_404(Poem, pk=pk)
    if request.method == 'POST':
        form = PoemForm(request.POST, instance=poem)
        if form.is_valid():
            form.save()
            messages.success(request, '诗词更新成功！')
            return redirect('poem_detail', pk=poem.pk)
    else:
        form = PoemForm(instance=poem)

    context = {
        'form': form,
        'poem': poem,
    }
    return render(request, 'poetry/poem_form.html', context)


@login_required
def poem_delete(request, pk):
    poem = get_object_or_404(Poem, pk=pk)
    if request.method == 'POST':
        poem.delete()
        messages.success(request, '诗词删除成功！')
        return redirect('poem_list')
    context = {'poem': poem}
    return render(request, 'poetry/poem_confirm_delete.html', context)


def appreciation_list(request):
    query = request.GET.get('q', '')
    appreciations = Appreciation.objects.all()

    if query:
        appreciations = appreciations.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(poem__title__icontains=query)
        )

    paginator = Paginator(appreciations, 8)
    page = request.GET.get('page', 1)
    appreciations = paginator.get_page(page)

    context = {
        'appreciations': appreciations,
        'query': query,
    }
    return render(request, 'poetry/appreciation_list.html', context)


def appreciation_detail(request, pk):
    appreciation = get_object_or_404(Appreciation, pk=pk)

    if request.method == 'POST' and request.user.is_authenticated:
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.appreciation = appreciation
            comment.save()
            messages.success(request, '评论发表成功！')
            return redirect('appreciation_detail', pk=pk)
    else:
        form = CommentForm()

    comments = appreciation.comments.filter(parent=None)

    context = {
        'appreciation': appreciation,
        'form': form,
        'comments': comments,
    }
    return render(request, 'poetry/appreciation_detail.html', context)


@login_required
def appreciation_create(request, poem_pk=None):
    poem = None
    if poem_pk:
        poem = get_object_or_404(Poem, pk=poem_pk)

    if request.method == 'POST':
        form = AppreciationForm(request.POST)
        if form.is_valid():
            appreciation = form.save(commit=False)
            appreciation.author = request.user
            if poem:
                appreciation.poem = poem
            else:
                poem_id = request.POST.get('poem')
                if poem_id:
                    appreciation.poem = get_object_or_404(Poem, pk=poem_id)
            appreciation.save()
            messages.success(request, '赏析发布成功！')
            return redirect('appreciation_detail', pk=appreciation.pk)
    else:
        form = AppreciationForm()

    poems = Poem.objects.all()
    context = {
        'form': form,
        'poems': poems,
        'selected_poem': poem,
    }
    return render(request, 'poetry/appreciation_form.html', context)


@login_required
def appreciation_edit(request, pk):
    appreciation = get_object_or_404(Appreciation, pk=pk)
    if request.user != appreciation.author and not request.user.is_superuser:
        messages.error(request, '您没有权限编辑此赏析！')
        return redirect('appreciation_detail', pk=pk)

    if request.method == 'POST':
        form = AppreciationForm(request.POST, instance=appreciation)
        if form.is_valid():
            form.save()
            messages.success(request, '赏析更新成功！')
            return redirect('appreciation_detail', pk=appreciation.pk)
    else:
        form = AppreciationForm(instance=appreciation)

    context = {
        'form': form,
        'appreciation': appreciation,
    }
    return render(request, 'poetry/appreciation_form.html', context)


@login_required
def appreciation_delete(request, pk):
    appreciation = get_object_or_404(Appreciation, pk=pk)
    if request.user != appreciation.author and not request.user.is_superuser:
        messages.error(request, '您没有权限删除此赏析！')
        return redirect('appreciation_detail', pk=pk)

    if request.method == 'POST':
        appreciation.delete()
        messages.success(request, '赏析删除成功！')
        return redirect('appreciation_list')

    context = {'appreciation': appreciation}
    return render(request, 'poetry/appreciation_confirm_delete.html', context)


def category_list(request):
    categories = Category.objects.all()
    context = {'categories': categories}
    return render(request, 'poetry/category_list.html', context)


def category_detail(request, pk):
    category = get_object_or_404(Category, pk=pk)
    poems = category.poems.all()

    paginator = Paginator(poems, 10)
    page = request.GET.get('page', 1)
    poems = paginator.get_page(page)

    context = {
        'category': category,
        'poems': poems,
    }
    return render(request, 'poetry/category_detail.html', context)


@login_required
def category_create(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, '分类创建成功！')
            return redirect('category_list')
    else:
        form = CategoryForm()

    context = {'form': form}
    return render(request, 'poetry/category_form.html', context)


@login_required
def comment_delete(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    if request.user != comment.user and not request.user.is_superuser:
        messages.error(request, '您没有权限删除此评论！')
        if comment.poem:
            return redirect('poem_detail', pk=comment.poem.pk)
        else:
            return redirect('appreciation_detail', pk=comment.appreciation.pk)

    if request.method == 'POST':
        if comment.poem:
            redirect_url = redirect('poem_detail', pk=comment.poem.pk)
        else:
            redirect_url = redirect('appreciation_detail', pk=comment.appreciation.pk)
        comment.delete()
        messages.success(request, '评论删除成功！')
        return redirect_url

    context = {'comment': comment}
    return render(request, 'poetry/comment_confirm_delete.html', context)


@login_required
def appreciation_like(request, pk):
    appreciation = get_object_or_404(Appreciation, pk=pk)
    appreciation.likes += 1
    appreciation.save()
    return redirect('appreciation_detail', pk=pk)
