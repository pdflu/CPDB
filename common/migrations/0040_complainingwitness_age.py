# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0039_auto_20150906_1516'),
    ]

    operations = [
        migrations.AddField(
            model_name='complainingwitness',
            name='age',
            field=models.IntegerField(null=True),
        ),
    ]
