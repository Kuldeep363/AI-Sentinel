# Generated by Django 3.2.4 on 2021-06-23 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ai', '0009_auto_20210622_1617'),
    ]

    operations = [
        migrations.AddField(
            model_name='members',
            name='date_added',
            field=models.DateField(blank=True, null=True),
        ),
    ]
