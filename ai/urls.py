from django.urls import path
from . import views as view

urlpatterns = [
    path('',view.home,name='home'),
    path('api/get-vehicles-data',view.viewData),
    path('api/check-member',view.check_member),
    path('api/get-img',view.get_image),
    path('api/add-entry',view.add_vehicle_entry),
]
