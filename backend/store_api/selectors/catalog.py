from ..models import Category, Product


def categories():
    return Category.objects.select_related('parent').prefetch_related('subcategories').order_by('id')


def products():
    return Product.objects.select_related('category').order_by('id')


def category_ids(category):
    # Fetch the taxonomy once, then traverse descendants without per-level queries.
    pairs = list(Category.objects.values_list('id', 'parent_id'))
    ids = {category.id}
    previous = -1
    while len(ids) != previous:
        previous = len(ids)
        ids.update(pk for pk, parent_id in pairs if parent_id in ids)
    return ids


def filtered_products(category=None, category_slug=None):
    result = products()
    if category is not None:
        return result.filter(category_id=category)
    if category_slug is not None:
        selected = Category.objects.filter(slug=category_slug).first()
        return result.filter(category_id__in=category_ids(selected)) if selected else result.none()
    return result
