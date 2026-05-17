from rest_framework import serializers
from .models import Term, Course

class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    # Using StringRelatedField so prerequisites return the course name instead of just an ID
    prerequisites = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'