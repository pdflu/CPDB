# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def auto_increment(apps, schema_editor):
    AllegationCategory = apps.get_model('common','AllegationCategory')
    counter = 1
    for category in AllegationCategory.objects.all():
        category.id = counter
        category.save()
        counter += 1

def set_new_cat_id(apps, schema_editor):
    Allegation = apps.get_model('common', 'Allegation')
    for allegation in Allegation.objects.all():
        if allegation.cat:
            allegation.allegation_category_id = allegation.cat.id
            allegation.save()

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0055_allegationcategory_id'),
    ]

    operations = [
        migrations.RunPython(auto_increment),
        migrations.RunPython(set_new_cat_id),


    ]
