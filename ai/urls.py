from django.urls import path
from . import views as view

urlpatterns = [
    path('',view.home,name='home'),
    path('members',view.members,name='member'),
    path('scan',view.scanner,name='scanner'),
    path('vehicle-details',view.vehicle_details,name='details'),
    path('api/get-vehicles-data',view.viewData),
    path('api/check-member',view.check_member),
    path('api/get-img',view.get_image),
    path('api/add-entry',view.add_vehicle_entry),
    path('api/get-members-data',view.get_members),
    path('api/add-members-data',view.add_member),
    path('api/search-member',view.search_member),
    path('api/add-exit',view.exit_details),
    path('api/search-vehicle',view.search_vehicle),
    path('api/get-details',view.get_details),
]
