from rest_framework import serializers
from .models import BaseUser, StudentProfile, RegistrarProfile, CashierProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['student_id', 'program_enrolled', 'year_level', 'enrollment_status']

class UserSerializer(serializers.ModelSerializer):
    # These nested serializers allow the API to return profile data alongside the user's email
    student_profile = StudentProfileSerializer(read_only=True)

    class Meta:
        model = BaseUser
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'student_profile']