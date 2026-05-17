from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Models and Serializers
# Import from the local enrollment app
from .models import EnrollmentRecord, EnrolledClass

# Import from your other apps!
from academics.models import Instructor, Subject
from scheduling.models import Section
from accounts.models import StudentProfile, ChangeRequest

from .serializers import (
    EnrollmentRecordSerializer, EnrolledClassSerializer, 
    SectionSerializer, InstructorSerializer, SubjectSerializer, 
    StudentProfileSerializer, ChangeRequestSerializer
)


# Custom Permissions
from accounts.permissions import IsStudent, IsRegistrar, IsAdminUserRole 

# --- YOUR EXISTING SECURED VIEWS ---

class EnrollmentRecordViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentRecord.objects.all()
    serializer_class = EnrollmentRecordSerializer
    
    def get_permissions(self):
        permission_classes = [IsAuthenticated, IsAdminUserRole | IsStudent | IsRegistrar]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.role == 'STUDENT':
            return self.queryset.filter(student__user=self.request.user)
        return self.queryset

class EnrolledClassViewSet(viewsets.ModelViewSet):
    queryset = EnrolledClass.objects.all()
    serializer_class = EnrolledClassSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsStudent | IsRegistrar]

# --- THE NEW PHASE 7 VIEWS (Add RBAC here too if you want!) ---

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    # Example: Only Admins and Registrars can mess with sections!
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsRegistrar | IsStudent]  # You can adjust this as needed

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsRegistrar | IsStudent]  # Adjust as needed

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsRegistrar | IsStudent]  # Adjust as needed

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsRegistrar | IsStudent]

class ChangeRequestViewSet(viewsets.ModelViewSet):
    queryset = ChangeRequest.objects.all()
    serializer_class = ChangeRequestSerializer
    # Everyone needs access to requests (Students to make them, Admins to approve them)
    permission_classes = [IsAuthenticated, IsAdminUserRole | IsStudent | IsRegistrar]