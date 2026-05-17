from django.contrib import admin
from .models import BaseUser, StudentProfile, AdminProfile, RegistrarProfile, CashierProfile

admin.site.register(BaseUser)
admin.site.register(StudentProfile)
admin.site.register(AdminProfile)
admin.site.register(RegistrarProfile)
admin.site.register(CashierProfile)