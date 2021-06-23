from django.db import models
from django.db.models import fields
from rest_framework import serializers
from .models import Members, Vehicles

class memberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = '__all__'

class vehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicles
        fields = '__all__'