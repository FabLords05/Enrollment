from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # 🟢 1. Import this

from .models import Term, Course
from .serializers import TermSerializer, CourseSerializer

class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = TermSerializer
    permission_classes = [IsAuthenticated] # 🟢 2. Add this line

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated] # 🟢 3. Add this line