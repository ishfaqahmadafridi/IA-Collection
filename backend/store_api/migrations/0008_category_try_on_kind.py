from django.db import migrations, models

# Initial tagging for existing catalogs. Admins can change it per category later.
TOP = ['Kurta', 'Kurti', 'Shalwar Kameez', 'Sherwani', 'Waistcoat', 'T-Shirts', 'Shirts', 'Coat']
BOTTOM = ['Jeans', 'Trousers', 'Pants']


def tag_categories(apps, schema_editor):
    Category = apps.get_model('store_api', 'Category')
    Category.objects.filter(name__in=TOP).update(try_on_kind='top')
    Category.objects.filter(name__in=BOTTOM).update(try_on_kind='bottom')


class Migration(migrations.Migration):

    dependencies = [
        ('store_api', '0007_enforce_integrity_and_store_profile_files'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='try_on_kind',
            field=models.CharField(blank=True, choices=[('', 'Not supported'), ('top', 'Top'), ('bottom', 'Bottom')], default='', max_length=10),
        ),
        migrations.RunPython(tag_categories, migrations.RunPython.noop),
    ]
