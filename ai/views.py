import re
from django.shortcuts import render
from rest_framework import serializers

from .models import Members,Vehicles
from .serializers import memberSerializer,vehicleSerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response


from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

import requests
import json

# Create your views here.
def home(request):
    return render(request,'ai/index.html')


def members(request):
    return render(request,'ai/members.html')


def scanner(request):
    return render(request,'ai/scanner.html')


@api_view(['GET'])
def viewData(request):
    vehicles = Vehicles.objects.all().order_by('-id')
    serializer = vehicleSerializer(vehicles,many = True)
    return Response(serializer.data)


def check_member(number): 
    # print(data)
    number = str(number)
    try:
        Members.objects.get(car_number=number)
        return True
    except:
        return False




@api_view(['POST'])
def get_image(request):
    data = request.data

    payload = { 'isOverlayRequired':True,
                'apikey':'fac41c9c0888957',
                'language':'eng',
                'scale': True,
                'OCREngine':2,
                'base64Image':data['img']
            }
    r = requests.post('https://api.ocr.space/parse/image',
    data=payload,
    )

    # print(r.content.decode())
    number = json.loads(r.content.decode())
    number_plate = number['ParsedResults'][0]['TextOverlay']['Lines'][0]['Words'][0]['WordText']
    print(number_plate)

    permission = check_member(number_plate)

    return Response({"permission":permission,"number":number_plate})


@api_view(['POST'])
def add_vehicle_entry(request):
    data = request.data
    number = str(data['number'])
    print(number)
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    entry_time = now.strftime("%H:%M:%S")
    mem = False

    try:
        member = Members.objects.get(car_number=number)
        print('1')
        owner = member.owner
        phone = member.phone_number
        print('2')
        mem = True
        car_type = member.four_wheeler
        Vehicles(owner=owner,car_number=number,entry_date=date,entry_timing=entry_time,phone_number=phone,member=mem,four_wheeler=car_type).save()
    except Exception as e:
        print(e)
        owner = data['name']
        phone = data['phone']
        car_type = bool(data['type'])
        purpose = data['purpose']
        Vehicles(owner=owner,car_number=number,entry_date=date,entry_timing=entry_time,phone_number=phone,member=mem,four_wheeler=car_type,purpose=purpose).save()
    
    return Response({'action':True})

@api_view(['POST'])
def  add_member(request):
    try:
        data = request.data 
        owner = data['name']
        number = data['number']
        phone = data['phone']
        email = data['email']
        address = data['address']
        car = data['type']
        now = datetime.now()
        date = now.strftime("%Y-%m-%d")

        Members(owner=owner,flat_address=address,car_number=number,phone_number=phone,email_id=email,four_wheeler=car,date_added=date).save()
        return Response({'action':True})
    except:
        return Response({"action":False})


@api_view(['POST'])
def search_member(request):
    number = request.data['number']

    try:
        member = Members.objects.get(car_number=number)
        serializer = memberSerializer(member)
        data = serializer.data
        data['action'] = True
        return Response(data)
    except:
        return Response({'action':False})

@api_view(['POST'])
def exit_details(request):
    img = request.data['img']

    payload = { 'isOverlayRequired':True,
                'apikey':'fac41c9c0888957',
                'language':'eng',
                'scale': True,
                'OCREngine':2,
                'base64Image':img
            }
    r = requests.post('https://api.ocr.space/parse/image',
    data=payload,
    )

    # print(r.content.decode())
    number = json.loads(r.content.decode())
    number = number['ParsedResults'][0]['TextOverlay']['Lines'][0]['Words'][0]['WordText']
    print(number)



    try:
        mem = Members.objects.get(car_number=number)
        if not mem.exit_allow:
            return Response({'permission':False})
    except:
        pass
    vehicle = Vehicles.objects.filter(car_number=number,exit_timing__isnull=True)
    if vehicle:
        now = datetime.now()
        date = now.strftime("%Y-%m-%d")
        time = now.strftime("%H:%M:%S")
        vehicle[0].exit_date = date
        vehicle[0].exit_timing = time
        vehicle[0].save()
    return Response({'permission':True})


