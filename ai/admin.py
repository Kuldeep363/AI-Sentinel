from django.contrib import admin

# Register your models here.
from .models import Members,Vehicles


admin.site.register(Members)
admin.site.register(Vehicles)