from django.db import models
from django.db.models.fields import BooleanField

# Create your models here.
class Members(models.Model):
    owner = models.CharField(max_length=20,blank=False,null=False,default='member')
    flat_address = models.CharField(max_length=50,blank=False,null=False,default='abc')
    car_number = models.CharField(max_length=15,blank=False,null=False,default='abc12')
    phone_number = models.CharField(max_length=15,blank=True)
    email_id = models.EmailField(blank=True)
    date_added = models.DateField(auto_now_add=False,blank=True,null=True)
    four_wheeler = models.BooleanField(blank=True,default=True) 
    exit_allow = models.BooleanField(blank=False,null=False,default=True)

    def __str__(self):
        return self.owner



class Vehicles(models.Model):
    owner =  models.CharField(max_length=20,blank=False,null=False,default='abc')
    car_number = models.CharField(max_length=15,blank=False,null=False,default='abc12')
    entry_date = models.DateField(auto_now_add=False)
    exit_date = models.DateField(auto_now_add=False,blank=True,null=True)
    entry_timing = models.TimeField(blank=True,null=True)
    exit_timing = models.TimeField(blank=True,null=True)
    phone_number = models.CharField(max_length=15,blank=True)
    member = models.BooleanField(blank=True,default=False)
    four_wheeler = models.BooleanField(blank=True,default=True) 
    purpose = models.TextField(blank=True,default="-----")

    def __str__(self):
        return self.car_number